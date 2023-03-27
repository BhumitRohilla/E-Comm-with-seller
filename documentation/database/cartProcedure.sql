-------------------

--* Table

--create table cart (userName varchar(50) primary key, cartId int unique identity(1,1),foreign key(userName) references users(userName));

--create table cart_item (cartId int not null, ProductId int not null, quantity int not null default 1, foreign key(cartId) references cart(cartId), foreign key (ProductId) references Product(ProductId));


-------------------


alter function getQuantity(@pid int,@userName varchar(100)) 
returns int
as
begin
	declare @i int;
	declare @result int;
	select @i= count(userName) from cart where userName = @username;
	if @i = 0
	begin
		set @result = 0;
	end
	else
	begin
		set @i = 0;
		select @i= isnull(quantity,0) from cart_item where cartId = (select cartId from users where userName = @userName) and productId = @pid;
		set @result = @i;
	end
	return @result;
end;


------------------------------


alter procedure increaseQuantityByOne @userName varchar(50),@pid int
as
begin
	declare @quantity int;
	select @quantity = dbo.getQuantity(@pid,@userName);
	if @quantity = 0
		begin
		declare @userExists int;
		select @userExists= count(*) from cart where userName = @userName;
		if @userExists = 1
			begin
			insert into cart_item values( (select cartId from cart where userName = @userName),@pid,1);
			end
		else
			begin
			insert into cart values(@userName);
			insert into cart_item values( (select max(cartId) from cart),@pid, 1);
		end
	end
	else
		update cart_item set quantity=((select quantity from cart_item where cartId = (select cartid from cart where userName = @userName) and productId = @pid)+1) where cartid = (select cartId from cart where userName = @userName) and productId = @pid;
end


-------------------------


alter procedure decreaseQuantityByOne @userName varchar(50),@pid int
as
begin
	declare @quantity int;
	select @quantity = dbo.getQuantity(@pid,@userName);
	if @quantity > 0
	begin
		update cart_item set quantity=((select quantity from cart_item where cartId = (select cartid from cart where userName = @userName) and productId = @pid)-1) where cartid = (select cartId from cart where userName = @userName) and productId = @pid;
		exec increaseStock @pid
	end
end


-------------------------


create procedure DeleteCartForSpecificUser @userName varchar(50)
as
begin
	delete cart_Item where cartId = (select cartId from cart where userName = @userName)
	delete cart where userName = @userName;
end


-------------------------