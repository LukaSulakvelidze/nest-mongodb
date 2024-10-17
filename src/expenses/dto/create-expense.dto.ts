import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  expense: string;

  @IsNotEmpty()
  @IsNumber()
  expense_amount: number;
}
