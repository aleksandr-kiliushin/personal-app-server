import { boards } from "#e2e/constants/boards"
import { budgetCategories, budgetRecords } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Find budget record", () => {
  test.each<{
    queryNameAndArgs: string
    foundRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `budgetRecord(id: ${budgetRecords["1st"].id})`,
      foundRecord: budgetRecords["1st"],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `budgetRecord(id: ${budgetRecords["4th"].id})`,
      foundRecord: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndArgs: `budgetRecord(id: 666)`,
      foundRecord: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.budgetRecord}
      }
    }`)
    expect(responseBody.data?.budgetRecord).toEqual(foundRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search budget records", () => {
  test.each<{
    queryNameAndArgs: string
    foundRecords: unknown[]
  }>([
    {
      queryNameAndArgs: `budgetRecords`,
      foundRecords: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
    },
    {
      queryNameAndArgs: `budgetRecords(boardsIds: [${boards.cleverBudgetiers.id}, 666666])`,
      foundRecords: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
    },
    {
      queryNameAndArgs: `budgetRecords(boardsIds: [666666])`,
      foundRecords: [],
    },
    {
      queryNameAndArgs: `budgetRecords(boardsIds: [${boards.megaEconomists.id}])`,
      foundRecords: [],
    },
    {
      queryNameAndArgs: `budgetRecords(categoriesIds: [${budgetCategories.educationExpense.id}])`,
      foundRecords: [budgetRecords["3rd"], budgetRecords["2nd"]],
    },
    {
      queryNameAndArgs: `budgetRecords(dates: ["2022-08-01"])`,
      foundRecords: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]],
    },
    {
      queryNameAndArgs: `budgetRecords(amount: ${budgetRecords["2nd"].amount})`,
      foundRecords: [budgetRecords["2nd"]],
    },
    {
      queryNameAndArgs: `budgetRecords(orderingByDate: "ASC", orderingById: "ASC", isTrashed: true, skip: 1, take: 1)`,
      foundRecords: [budgetRecords["2nd"]],
    },
    // {
    //   url: `/api/budget/records/search?isTrashed=hehe`,
    //   responseBody: {
    //     fields: {
    //       isTrashed: "Should be a boolean.",
    //     },
    //   },
    //   responseStatus: 400,
    // },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundRecords }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.budgetRecord}
      }
    }`)
    expect(responseBody.data.budgetRecords).toEqual(foundRecords)
  })
})
