-------------------

--* Table

create table cart (userName varchar(50) primary key, cartId int unique identity(1,1),foreign key(userName) references users(userName));

create table cart_item (cartId int not null, ProductId int not null, quantity int not null default 1, foreign key(cartId) references cart(cartId), foreign key (ProductId) references Product(ProductId));


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
			insert into cart(userName) values(@userName);
			insert into cart_item values( (select cartId from cart where userName = @userName),@pid, 1);
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
		begin transaction
		begin try
			exec increaseStock @pid;
			update c1 set quantity = ((select quantity from cart_item c2 where c1.cartId = c2.cartId and c1.ProductId = c2.ProductId )-1) from cart_item as c1 where ProductId = @pid and CartId = (select CartId from Cart where userName = @userName);
			commit;
		end try
		begin catch
			rollback transaction;
		end catch
	end
end


-------------------------


--! FOR TESTING PURPOSE ONLY
create procedure DeleteCartForSpecificUser @userName varchar(50)
as
begin
	delete cart_Item where cartId = (select cartId from cart where userName = @userName)
	delete cart where userName = @userName;
end


-------------------------


alter procedure deleteFromCart @userName varchar(50), @pid int
as
begin
	begin transaction
	begin try
		update Product set stock = ((select stock from Product as p2 where Product.ProductId = p2.ProductId) + (select quantity from Cart_Item where cartId = (select cartId from cart where userName = @userName and ProductId = @pid) and ProductId = @pid)) where ProductId = @pid;
		delete cart_item where cartId = (select cartId from cart where userName = @userName) and ProductId = @pid;
		commit;
	end try
	begin catch
		rollback transaction;
	end catch
end

-------------------------


alter procedure getTotalPrice @userName varchar(50)
as
begin
	
	declare @cur cursor;
	declare @quantity int;
	declare @totalPrice int;
	declare @currentPrice int;
	set @totalPrice = 0;
	set @cur = cursor for select quantity,price from cart_item inner join Product_price on Product_price.ProductId = cart_item.ProductId where cartId = (select cartId from Cart where userName = @userName);
	open @cur;
	fetch next from @cur into @quantity,@currentPrice;
	while @@FETCH_STATUS = 0
	begin
		set @totalPrice = @totalPrice + @currentPrice * @quantity
		fetch next from @cur into @quantity,@currentPrice;
	end
	select @totalPrice;
end


------------------------