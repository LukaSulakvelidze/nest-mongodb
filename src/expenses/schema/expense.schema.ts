import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Expense {
  @Prop()
  expense: string;
  @Prop()
  expense_amount: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Schema.Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
