------------------------------

--*Table

--create table Product_Tag (productId int primary key,tag varchar(2000), foreign key (productId) references Product(productId));

--create table About_Product(ProductId int primary key, [about-game] varchar(8000) not null, foreign key(ProductId) references Product(ProductId));

--create table Product (productId int default 1 primary key, sellerName varchar(50), title varchar(100),DateOfRelease date,status varchar(10),userReview int, Img varchar(50),active bit, Foreign key (sellerName) references users(userName));


----------------------------

--*initial load




-----------------------------

--?? Triggers

alter Trigger addProductId on Product instead of insert
as
begin 
declare @cur cursor;
declare @sellerName varchar(50);
declare @date date;
declare @id int;
declare @title varchar(50);
declare @status varchar(10);
declare @userReview int;
declare @img varchar(50);
declare @active bit;
declare @maxid int;
declare @tag varchar(2000);
declare @stock int;
set @cur = cursor for select sellerName,title,[date],[status],userReviews,img,active,stock from  Inserted;
open @cur
fetch next from @cur into @sellerName,@title,@date,@status,@userReview,@img,@active,@stock;

while @@FETCH_STATUS = 0
begin
	select @maxid = isnull(max(productId),0) from Product;
	set @maxid = @maxid +1;
	insert into Product(productId,sellerName,title,[date],[status],userReviews,img,active,stock) values(@maxid,@sellerName,@title,@date,@status,@userReview,@img,@active,@stock);
	fetch next from @cur into @sellerName,@title,@date,@status,@userReview,@img,@active,@stock;
end
end


------------------------------

alter procedure insertIntoProduct @sellerName varchar(50),@title varchar(100),@date date,@stock int,@userReview int,@status varchar(10) ,@img varchar(50),@active bit,@tag varchar(2000),@about varchar(8000)
as
begin
	declare @id int;
	insert into Product(sellerName,title,[date],stock,status,userReviews,Img,active) values(@sellerName,@title,@date,@stock,@status,@userReview,@img,@active);
	select TOP(1) @id=productId from Product order by productId desc;
	insert into Product_Tag values(@id,@tag);
	insert into About_Product values(@id,@about);
end


------------------------------


alter function getProduct(@start int,@length int)
returns table
as
	return select Product.*,c1.tag,[about-game] from Product inner join (select Product_Tag.*,[about-game] from Product_Tag join About_Product on Product_Tag.productId = About_Product.productId) as c1 on c1.productId = Product.productId where active = 1 order by productId OFFSET @start rows fetch next @length rows only ;


------------------------------

alter procedure decraseStock @pid int
as
begin
	update Product set stock = ((select stock from Product where ProductId = @pid)-1) where ProductId = @pid;
end

-------------------------------

alter procedure increaseStock @pid int
as
begin
	update Product set stock = ((select stock from Product where ProductId = @pid)+1) where ProductId = @pid;
end

-------------------------------

alter function getAllProduct()
returns table
as
	return select Product.*,c1.tag,[about-game] from Product inner join (select Product_Tag.*,[about-game] from Product_Tag join About_Product on Product_Tag.productId = About_Product.productId) as c1 on c1.productId = Product.productId where active = 1;


------------------------------


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


---------------------------------

alter procedure updateProduct @id int, @title varchar(100), @date date,@status varchar(10), @userReview int, @img varchar(50), @stock int, @tag varchar(2000), @about varchar(8000)
as
begin
	update Product set title=@title,date=@date,[status]=@status,userReviews=@userReview,img=@img,stock=@stock where ProductId = @id;
	update About_Product set [about-game] = @about where ProductId = @id;
	update Product_Tag set tag = @tag where ProductId = @id;
end

---------------------------------