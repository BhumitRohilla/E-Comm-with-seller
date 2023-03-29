alter procedure PlaceOrder @sellerName varchar(50),@orderId int,@ProductId int,@quantity int,@price int,@userName varchar(50)
as
begin
	begin transaction
	begin try
		insert into Order_Item(sellerName,OrderId,ProductId,quantity,resolve,status,price) values(@sellerName,@orderId,@ProductId,@quantity,0,0,@price);
		delete cart_item where CartId = (select cartId from Cart where userName = @userName ) and ProductId = @ProductId;
		commit;
	end try
	begin catch
		rollback transaction;
	end catch
end