import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { FinanceCategoryEntity } from "#models/finance-category/entities/finance-category.entity"
import { FinanceCategoryService } from "#models/finance-category/service"

import { CreateFinanceRecordDto } from "./dto/create-finance-record.dto"
import { SearchFinanceRecordsQueryDto } from "./dto/search-finance-records-query.dto"
import { UpdateFinanceRecordDto } from "./dto/update-finance-record.dto"
import { FinanceRecordEntity } from "./entities/finance-record.entity"

@Injectable()
export class FinanceRecordService {
  constructor(
    @InjectRepository(FinanceRecordEntity)
    private financeRecordRepository: Repository<FinanceRecordEntity>,
    private financeCategoryService: FinanceCategoryService
  ) {}

  search(query: SearchFinanceRecordsQueryDto): Promise<FinanceRecordEntity[]> {
    return this.financeRecordRepository.find({
      order: {
        id: query.orderingById ?? "desc",
        date: query.orderingById ?? "desc",
      },
      relations: { category: { type: true } },
      skip: query.skip === undefined ? 0 : parseInt(query.skip),
      ...(query.take !== undefined && { take: parseInt(query.take) }),
      where: {
        ...(query.amount !== undefined && { amount: In(query.amount.split(",")) }),
        ...(query.date !== undefined && { date: In(query.date.split(",")) }),
        ...(query.categoryId !== undefined && { categoryId: In(query.categoryId.split(",")) }),
        ...(query.id !== undefined && { id: In(query.id.split(",")) }),
        ...(query.groupId !== undefined && { category: { group: { id: In(query.groupId.split(",")) } } }),
        ...(query.isTrashed === "true" && { isTrashed: true }),
        ...(query.isTrashed === "false" && { isTrashed: false }),
      },
    })
  }

  async findById(id: FinanceRecordEntity["id"]): Promise<FinanceRecordEntity> {
    const financeRecord = await this.financeRecordRepository.findOne({
      relations: { category: { type: true } },
      where: { id },
    })
    if (financeRecord === null) {
      throw new NotFoundException({ message: `Record with ID '${id}' not found.` })
    }
    return financeRecord
  }

  async create(createFinanceRecordDto: CreateFinanceRecordDto): Promise<FinanceRecordEntity> {
    if (typeof createFinanceRecordDto.amount !== "number" || createFinanceRecordDto.amount <= 0) {
      throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
    }
    if (createFinanceRecordDto.categoryId === undefined) {
      throw new BadRequestException({ fields: { categoryId: "Required field." } })
    }
    let category: FinanceCategoryEntity | undefined
    try {
      category = await this.financeCategoryService.findById(createFinanceRecordDto.categoryId)
    } catch {
      throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
    }
    if (createFinanceRecordDto.date === undefined) {
      throw new BadRequestException({ fields: { date: "Required field." } })
    }
    if (!/\d\d\d\d-\d\d-\d\d/.test(createFinanceRecordDto.date)) {
      throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
    }
    const record = this.financeRecordRepository.create(createFinanceRecordDto)
    record.category = category
    return this.financeRecordRepository.save(record)
  }

  async updateFinanceRecord(
    id: FinanceRecordEntity["id"],
    updateFinanceRecordDto: UpdateFinanceRecordDto
  ): Promise<FinanceRecordEntity> {
    const record = await this.findById(id)
    if (updateFinanceRecordDto.amount !== undefined) {
      if (typeof updateFinanceRecordDto.amount !== "number" || updateFinanceRecordDto.amount <= 0) {
        throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
      }
      record.amount = updateFinanceRecordDto.amount
    }
    if (typeof updateFinanceRecordDto.isTrashed === "boolean") {
      record.isTrashed = updateFinanceRecordDto.isTrashed
    }
    if (updateFinanceRecordDto.date !== undefined) {
      if (!/\d\d\d\d-\d\d-\d\d/.test(updateFinanceRecordDto.date)) {
        throw new BadRequestException({ fields: { date: "Should have format YYYY-MM-DD." } })
      }
      record.date = updateFinanceRecordDto.date
    }
    if (updateFinanceRecordDto.categoryId !== undefined) {
      try {
        record.category = await this.financeCategoryService.findById(updateFinanceRecordDto.categoryId)
      } catch {
        throw new BadRequestException({ fields: { categoryId: "Invalid category." } })
      }
    }
    return this.financeRecordRepository.save(record)
  }

  async deleteFinanceRecord(id: FinanceRecordEntity["id"]): Promise<FinanceRecordEntity> {
    const record = await this.findById(id)
    await this.financeRecordRepository.delete(id)
    return record
  }
}
