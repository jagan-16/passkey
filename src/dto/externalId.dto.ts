import { IsString ,IsNotEmpty, Length } from 'class-validator';
export class ExternalIdDto
{
    @IsString({message :'externalId must be a string'})
    @IsNotEmpty({message:'externalId cannot be empty'})
    @Length(2,100, {message:'externalId must be between 2 and 10 characters'})
    externalId: string; 
    
}

