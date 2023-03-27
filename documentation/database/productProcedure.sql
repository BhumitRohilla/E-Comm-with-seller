------------------------------

--*Table

--create table Product_Tag (productId int primary key,tag varchar(2000), foreign key (productId) references Product(productId));

--create table About_Product(ProductId int primary key, [about-game] varchar(8000) not null, foreign key(ProductId) references Product(ProductId));

--create table Product (productId int default 1 primary key, sellerName varchar(50), title varchar(100),DateOfRelease date,status varchar(10),userReview int, Img varchar(50),active bit, Foreign key (sellerName) references users(userName));


----------------------------

--*initial load
alter procedure insertIntoProduct @sellerName varchar(50),@title varchar(100),@date date,@stock int,@userReview int,@status varchar(10) ,@img varchar(50),@active bit,@tag varchar(2000),@about varchar(8000)

exec insertIntoProduct 'bhumitS','LIGHT OF ALARIYA','2023-03-01',96,10,'Positive','light-of-alariya.jpg',1,'Exploration Puzzle-Platformer PRG Puzzle Sailing','Light of Alariya is an open-world, third-person, exploration puzzle game made by students at SMU Guildhall. In Light of Alariya, you traverse the ancient alien temples and ruins to restore the power of the stars and awaken your sleeping civilization.';
exec insertIntoProduct 'bhumitS','Ogre Chamber DX','2023-03-03',75,10,'Positive','ogre-chambers-dx.jpg',1,`Action-Roguelike Bullet-Hell Roguelike Sci-fi Shoot "Em up`, 'Roguelike bullet hell shooter, where you fend off waves of attacking monsters in a constantly transforming arena. You are rewarded with upgrades to your vulnerable spaceship if you survive long enough';
exec insertIntoProduct 'bhumitS','Elog Plug','2023-02-25',21,153,'Very Positive','elong-plug.jpg',1,'Adventure Comedy 3D-Platformer Cute Exploration','Play as an elastic plug trying to become as long as LORD ELON. Use your climbing, dangling, and stretching skills to collect coins and buy length upgrades. Will LORD ELON accept you?';
exec insertIntoProduct 'bhumitS','Couter Strike','2012-08-21',53,699070,'Positive','counter-strike.jpg',1,'FPS Shooter Multiplayer Competitive Action Team-Based','Counter-Strike: Global Offensive (CS: GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago. CS: GO features new maps, characters, weapons, and game modes, and delivers updated versions of the classic CS content (de_dust2, etc.).';
exec insertIntoProduct 'bhumitS','Red Dead Redemption 2','2019-12-05',102,345091,'Positive','red-dead-redemption-2.jpg',1,'Open-World Story-Rich Adventure Western Action Multiplayer Realistic','Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online.';
exec insertIntoProduct 'bhumitS','Call Of Duty','2003-10-29',95,4328,'Positive','cod-1.jpg',1,'FPS World-War-2 Action Classic Shooter', 'Call of Duty® delivers the gritty realism and cinematic intensity of World War II"s epic battlefield moments like never before - through the eyes of citizen soldiers and unsung heroes from an alliance of countries who together helped shape the course of modern history.n-world, third-person, exploration puzzle game made by students at SMU Guildhall. In Light of Alariya, you traverse the ancient alien temples and ruins to restore the power of the stars and awaken your sleeping civilization.'
exec insertIntoProduct 'bhumitS','Call Of Duty WORLD AT WAR','2008-11-18',94,37193,'Positive','call-of-duty-world-at-war.jpg',1,'Zombies World-War-2 FPS Multiplayer Action','Call of Duty is back, redefining war like you"ve never experienced before. Building on the Call of Duty 4®: Modern Warfare engine, Call of Duty: World at War immerses players into the most gritty and chaotic WWII combat ever experienced.';


exec insertIntoProduct 'bhumitS','CupHead','2017-09-29',105,117089,'Positive','cuphead.jpg',1,'Difficult Cartoon Co-op Platformer Great-SoundTrack Hand-drawn Multiplayer','Cuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era, i.e. traditional hand drawn cel animation, watercolor backgrounds, and original jazz recordings.';
exec insertIntoProduct 'bhumitS','GOD OF WAR','2023-03-01',75,67214,'Positive','god-of-war.png',1,'Exploration Puzzle-Platformer RPG Puzzle Sailing','His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same.';
exec insertIntoProduct 'bhumitS','ELDEAN RING','2022-02-24',99,469056,'Positive','elden-ring.png',1,'Souls-Like Dark-Fantasy RPG Open-World Difficult Fantasy','THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. ';
exec insertIntoProduct 'bhumitS','Halo: The Master Chief Collection','2019-12-02',22,183433,'Positive','halo.jpg',1,'Greate-SoundTrack FPS Classic Multiplayer Story-Rich Sci-fi First-Person','The Master Chief’s iconic journey includes six games, built for PC and collected in a single integrated experience. Whether you’re a long-time fan or meeting Spartan 117 for the first time, The Master Chief Collection is the definitive Halo gaming experience.';

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