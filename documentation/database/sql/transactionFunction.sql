alter procedure addToCartAndRemoveStock @userName varchar(50),@pid int
as
begin
		declare @stock int;
		select @stock= stock from Product where ProductId = @pid;
		if @stock > 0
		begin
			begin transaction
			begin try
				begin
					exec decraseStock @pid;
					exec increaseQuantityByOne @userName,@pid;
				end
			commit;
			end try
			begin catch
				rollback transaction;
			end catch
		end
		else
			throw 50409,'Out Of Stock',1;
end


