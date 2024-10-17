import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private userService: UsersService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, user: string) {
    const newExpense = await this.expenseModel.create({
      ...createExpenseDto,
      user,
    });
    await this.userService.addPost(user, newExpense._id);
    return newExpense;
  }

  findAll() {
    return this.expenseModel.find();
  }

  async findOne(id: string) {
    try {
      return await this.expenseModel.findById(id).populate('user');
    } catch (error) {
      if (error)
        throw new NotFoundException(
          'Not found. Id is incorrect or expense does not exist',
        );
    }
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    try {
      return await this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, {
        new: true,
      });
    } catch (error) {
      if (error)
        throw new NotFoundException(
          'Not found. Id is incorrect or expense does not exist',
        );
    }
  }

  async remove(id: string) {
    try {
      const deletedexpense = this.expenseModel.findByIdAndDelete(id);
      return deletedexpense;
    } catch (error) {
      if (error)
        throw new NotFoundException(
          'Not found. Id is incorrect or expense already deleted',
        );
    }
  }
}
