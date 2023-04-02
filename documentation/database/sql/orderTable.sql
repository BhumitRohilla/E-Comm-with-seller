
=================================================

--* Table Creation

create table Orders (userName varchar(50), OrderId int identity(1,1) not null,TimeOfPurchase datetime not null, unique(OrderId),foreign key (userName) references users(userName));
alter table Orders add paymentKey varchar(50);

create table Order_Item( sellerName varchar(50) not null,OrderId int not null,ProductId int not null,quantity int not null,resolve bit,[status] bit,price decimal(12,2), foreign key(sellerName) references users(userName),foreign key (OrderId) references Orders(OrderId),foreign key(ProductId) references Product(ProductId));
alter table Order_Item add SubOrderId int identity(1,1);
alter table Order_Item add constraint UK_SUBORDERID_ORDERITEM unique(SubOrderId);

--! depricated table
create table Order_Holder (OrderId int foreign key references Orders(OrderId) not null, ProductId int foreign key references Product(ProductId) not null, quantity int not null , price int not null, check(quantity > 0), check (price >= 0),primary key (OrderId,ProductId));




create table Product_Key (SubOrderId int, ProductKey varchar(20) not null, foreign key(SubOrderId) references Order_Item(SubOrderId) );



=========================================================

--* Indexing

create clustered index PK_INDEX_ORDERS on Orders(userName,OrderId);
create index NON_C_Payment_Key_Order on Orders(paymentKey);

create clustered index Order_Item_Index on Order_Item(sellerName,TimeOfPurchase);
create index NON_CLUSTERED_SELLER_INDEX on Order_Item(sellerName);


=========================================================

--* Trigger


alter Trigger insertIntoOrder on Orders instead of insert
as
begin
	declare @userName varchar(50);
	declare @OrderId int;
	select @userName = userName from Inserted;
	select @OrderId = max(OrderId) from Orders;
	insert into Orders(orderId,userName,TimeOfPurchase) values(@OrderId+1,@userName,GETDATE());
	select @OrderId+1;
end



create trigger InsertOrderItemTrigger on Order_Item instead of insert
as
begin
	declare @cur cursor;
	declare @OrderId int;
	declare @ProductId int;
	declare @quantity int;
	declare @price int;
	declare @totalPrice int;
	declare @sellerName varchar(50);
	set @cur = cursor for select OrderId,ProductId,quantity from inserted;
	open @cur;
	fetch next from @cur into @OrderId, @ProductId, @quantity;
	while @@FETCH_STATUS = 0
	begin
		select @price = price from Product_Price where ProductId = @ProductId;
		set @totalPrice = @price*@quantity;
		select @sellerName = sellerName from Product where ProductId = @ProductId;
		insert into Order_Item(sellerName,OrderId,ProductId,quantity,resolve,[status],price) values(@sellerName ,@OrderId,@ProductId,@quantity,0,0, @totalPrice);
		fetch next from @cur into @OrderId,@ProductId,@quantity;
	end
end



create trigger OrderHolderInsertTrigger on Order_Holder instead of insert
as
begin
	declare @quantity int;
	declare @price int;
	declare @pid int;
	declare @cur cursor;
	declare @orderId int;
	declare @totalPrice int;
	set @cur = cursor for select OrderId,ProductId,quantity from inserted;
	open @cur
	fetch next from @cur into @orderId,@pid,@quantity;
	while @@FETCH_STATUS = 0
	begin
		select @price = price from Product_Price where ProductId = @pid;
		set @totalPrice = @price*@quantity;
		insert into Order_Holder values(@orderId,@pid,@quantity,@totalPrice);
		fetch next from @cur into @orderId,@pid,@quantity;
	end
end


================================================================


--* Queury

--! depricated
select Orders.*,ProductId,quantity,resolve,status,price from Orders inner join Order_Item on Orders.OrderId = Order_Item.OrderId where userName = 'bhumit';



================================================================

--* Procedure




create procedure insertIntoOrderHolder @OrderId int, @ProductId int,@quantity int,@userName varchar(50)
as
begin
	begin Transaction
	begin try
		insert into Order_Holder(OrderId,ProductId,quantity) values( @orderId,@ProductId,@quantity );
		delete cart_Item where cartId = (select cartId from Cart where userName = @userName) and ProductId = @ProductId;
		commit
	end try
	begin catch
		rollback transaction;
	end catch
end


-------------------------------------------


create Procedure insertIntoOrderItem @orderId int, @pid int,@quantity int, @userName varchar(50)
as
begin
	begin Transaction
	begin try
		insert into Order_Item(OrderId,ProductId,quantity) values(@orderId,@pid,@quantity);
		delete cart_Item where cartId = (select cartId from Cart where userName = @userName) and ProductId = @pid;
		commit;
	end try
	begin catch
		rollback transaction;
	end catch
end



----------------------------------------


alter procedure getPriceOfOrder @oid int
as
begin
	declare @totalPrice int;
	declare @cur cursor;
	declare @currentPrice int;
	set @cur = cursor for select price from Order_Item where OrderId = @oid;
	set @totalPrice = 0
	open @cur
	fetch next from @cur into @currentPrice; 
	while @@FETCH_STATUS = 0
	begin
		set @totalPrice = @totalPrice + @currentPrice;
		fetch next from @cur into @currentPrice;
	end
	select @totalPrice;
end


-----------------------------------------



alter procedure paymentSuccess @paymentKey varchar(50)
as
begin
	update Orders set PaymentStatus = 1, paymentKey = null where paymentKey = @paymentKey;
	select @@ROWCOUNT;
end


----------------------------------------

alter procedure paymentFail @paymentKey varchar(50)
as
begin
	declare @OrderId int;
	select @OrderId = OrderId from Orders where paymentKey = @paymentKey;
	if @OrderId is not null
	begin
		update Orders set PaymentStatus = -1, paymentKey = null where paymentKey = @paymentKey;
		select 1;
		exec restockCancelOrderStock @OrderId;
	end
	else
		select 0;
end

----------------------------------------

--! Depricated
create procedure paymentFail @paymentKey varchar(50)
as
begin
	update Orders set PaymentStatus = -1, paymentKey = null where paymentKey = @paymentKey
	select @@ROWCOUNT
end


---------------------------------------


alter procedure restockCancelOrderStock @OrderId int
as
begin
	begin transaction;
	begin try
	declare @cur cursor;
	declare @quantity int;
	declare @pid int;

	set @cur = cursor for select quantity , ProductId from Order_Item where OrderId = @OrderId;
	open @cur;
	fetch next from @cur into @quantity,@pid;
	
	while @@FETCH_STATUS = 0
	begin
		update Product set stock = ((select stock from Product where ProductId = @pid )+ @quantity) where ProductId = @pid;
		fetch next from @cur into @quantity,@pid;
	end
	commit;
	end try
	begin catch
		rollback transaction;
	end catch
end


----------------------------------------


--! depricated
create procedure insertIntoOrderHolder @OrderId int, @ProductId int,@quantity int,@userName varchar(50)
as
begin
	begin Transaction
	begin try
		insert into Order_Holder(OrderId,ProductId,quantity) values( @orderId,@ProductId,@quantity );
		delete cart_Item where cartId = (select cartId from Cart where userName = @userName) and ProductId = @ProductId;
		commit
	end try
	begin catch
		rollback transaction;
	end catch
end


