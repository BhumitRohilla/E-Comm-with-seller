
-------------------------------------------

--* Table Creation

create table Orders (userName varchar(50), OrderId int identity(1,1) not null,TimeOfPurchase datetime not null, unique(OrderId),foreign key (userName) references users(userName));

create table Order_Item( sellerName varchar(50) not null,OrderId int not null,ProductId int not null,quantity int not null,resolve bit,[status] bit,price decimal(5,2), foreign key(sellerName) references users(userName),foreign key (OrderId) references Orders(OrderId),foreign key(ProductId) references Product(ProductId));

create table Order_Holder (OrderId int foreign key references Orders(OrderId) not null, ProductId int foreign key references Product(ProductId) not null, quantity int not null , price int not null, check(quantity > 0), check (price >= 0),primary key (OrderId,ProductId));

-------------------------------------------

--* Indexing

create clustered index PK_INDEX_ORDERS on Orders(userName,OrderId);


create clustered index Order_Item_Index on Order_Item(sellerName,TimeOfPurchase);
create index NON_CLUSTERED_SELLER_INDEX on Order_Item(sellerName);


-------------------------------------------

--* Trigger

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


-------------------------------------------

--* Queury

select Orders.*,ProductId,quantity,resolve,status,price from Orders inner join Order_Item on Orders.OrderId = Order_Item.OrderId where userName = 'bhumit';

-------------------------------------------

--* Procedure
--// TODO: Change This into trigger insert instead


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