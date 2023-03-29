
-------------------------------------------

--* Table Creation

create table Orders (userName varchar(50), OrderId int identity(1,1) not null,TimeOfPurchase datetime not null, unique(OrderId),foreign key (userName) references users(userName));

create table Order_Item( sellerName varchar(50) not null,OrderId int not null,ProductId int not null,quantity int not null,resolve bit,[status] bit,price decimal(5,2), foreign key(sellerName) references users(userName),foreign key (OrderId) references Orders(OrderId),foreign key(ProductId) references Product(ProductId));

-------------------------------------------

--* Indexing

create clustered index PK_INDEX_ORDERS on Orders(userName,OrderId);


create clustered index Order_Item_Index on Order_Item(sellerName,TimeOfPurchase);
create index NON_CLUSTERED_SELLER_INDEX on Order_Item(sellerName);


-------------------------------------------

--* Queury

select Orders.*,ProductId,quantity,resolve,status,price from Orders inner join Order_Item on Orders.OrderId = Order_Item.OrderId where userName = 'bhumit';

-------------------------------------------

--* Procedure
--// TODO: Change This into trigger insert instead
alter Trigger insertIntoOrder on Orders instead of insert
as
begin
	declare @userName varchar(50);
	select @userName = userName from Inserted;
	insert into Orders(userName,TimeOfPurchase) values(@userName,GETDATE());
	select max(OrderId) from Orders;
end

-------------------------------------------