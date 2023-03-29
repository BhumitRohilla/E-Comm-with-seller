----------------------


--create table users (id int identity(1,1),userName varchar(50) primary key,password varchar(50) not null,email varchar(50) unique not null,isVarified bit not null,[key] varchar(50) unique, passwordChange varchar(50) unique,[name] varchar(50) not null);


----------------------

alter procedure deactivateSeller @userName varchar(50)
as
begin
	begin transaction
	begin try
		delete cart_item where ProductId in (select ProductId from Product where sellerName = @userName);
		update Product set active = 0 where sellerName = @userName;
		update users set active = 0 where userName = @userName and role = 'seller';
		commit ;
	end try
	begin catch
		rollback transaction;
	end catch
end

---------------------

create procedure reactivateSeller @userName varchar(50)
as
begin
	update users set active = 1 where userName = @userName and role = 'seller';
end

---------------------


alter  procedure createNewSeller @email varchar(50),@creationKey varchar(100)
as
begin
	declare @j int;
	declare @i int;
	select @i=count(*) from users where email = @email;
	if @i > 0 
		throw 50409,'User Already Exists',1;
	select @j=count(*) from SellerToCreate where email = @email;
	if @j = 0
		insert into SellerToCreate values(@email,@creationKey);
	else
		update SellerToCreate set userCreation = @creationKey where email = @email; 
end


---------------------


alter procedure createNewSellerFinal @userName varchar(50),@password varchar(100),@email varchar(50), @name varchar(50)
as
begin
	declare @i int;
	select @i = count(*) from users where userName = @userName;
	if @i > 0
		throw 50409,'User Already Exists',1;
	insert into users(userName,password,email,isVarified,passwordChange,active,role,[key],[name]) values(@userName,@password,@email,1,NULL,1,'seller',NULL,@name);
	delete SellerToCreate where email = @email;
end


-------------------


--! SHOULD BE USED FOR TESTING PURPOSE ONLY


create procedure completeDeleteSeller @sellerName varchar(50)
as
begin
	delete cart_item where ProductId in (select ProductId from Product where sellerName = @sellerName);
	delete Product_Tag where ProductId in (select ProductId from Product where sellerName = @sellerName);
	delete About_Product where ProductId in (select ProductId from Product where sellerName = @sellerName);
	delete Product where ProductId in (select ProductId from Product where sellerName = @sellerName);
	delete users where userName = @sellerName;
end


------------------