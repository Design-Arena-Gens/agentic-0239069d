"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type Category =
  | "Housing"
  | "Transportation"
  | "Groceries"
  | "Dining"
  | "Utilities"
  | "Insurance"
  | "Health"
  | "Subscriptions"
  | "Personal"
  | "Savings";

type PaymentMethod = "Card" | "Cash" | "Transfer";

type Expense = {
  id: string;
  description: string;
  category: Category;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  recurring?: boolean;
  notes?: string;
};

type CategoryBudget = {
  category: Category;
  allocated: number;
};

const MONTHLY_BUDGET = 3200;

const CATEGORY_BUDGETS: CategoryBudget[] = [
  { category: "Housing", allocated: 1200 },
  { category: "Transportation", allocated: 220 },
  { category: "Groceries", allocated: 450 },
  { category: "Dining", allocated: 250 },
  { category: "Utilities", allocated: 300 },
  { category: "Insurance", allocated: 220 },
  { category: "Health", allocated: 180 },
  { category: "Subscriptions", allocated: 120 },
  { category: "Personal", allocated: 200 },
  { category: "Savings", allocated: 260 },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "1",
    description: "Rent - Downtown Apartment",
    category: "Housing",
    amount: 1180,
    date: "2025-03-01",
    paymentMethod: "Transfer",
    recurring: true,
    notes: "Autopay",
  },
  {
    id: "2",
    description: "Grocery run - Green Market",
    category: "Groceries",
    amount: 126.4,
    date: "2025-03-05",
    paymentMethod: "Card",
  },
  {
    id: "3",
    description: "Monthly subway pass",
    category: "Transportation",
    amount: 89,
    date: "2025-03-02",
    paymentMethod: "Card",
    recurring: true,
  },
  {
    id: "4",
    description: "Dinner with friends",
    category: "Dining",
    amount: 64.5,
    date: "2025-03-08",
    paymentMethod: "Card",
  },
  {
    id: "5",
    description: "Electric bill",
    category: "Utilities",
    amount: 142.75,
    date: "2025-02-25",
    paymentMethod: "Transfer",
  },
  {
    id: "6",
    description: "Streaming bundle",
    category: "Subscriptions",
    amount: 39.99,
    date: "2025-03-03",
    paymentMethod: "Card",
    recurring: true,
  },
  {
    id: "7",
    description: "Renter's insurance",
    category: "Insurance",
    amount: 19.5,
    date: "2025-03-01",
    paymentMethod: "Transfer",
    recurring: true,
  },
  {
    id: "8",
    description: "Gym membership",
    category: "Health",
    amount: 58,
    date: "2025-02-28",
    paymentMethod: "Card",
    recurring: true,
  },
  {
    id: "9",
    description: "Weekend getaway savings",
    category: "Savings",
    amount: 150,
    date: "2025-03-10",
    paymentMethod: "Transfer",
  },
  {
    id: "10",
    description: "Coffee beans",
    category: "Personal",
    amount: 18.75,
    date: "2025-03-06",
    paymentMethod: "Card",
  },
  {
    id: "11",
    description: "Rideshare to meeting",
    category: "Transportation",
    amount: 24.6,
    date: "2025-03-09",
    paymentMethod: "Card",
  },
  {
    id: "12",
    description: "Lunch with mentor",
    category: "Dining",
    amount: 32.5,
    date: "2025-02-26",
    paymentMethod: "Card",
  },
  {
    id: "13",
    description: "Groceries - bulk store",
    category: "Groceries",
    amount: 94.15,
    date: "2025-02-18",
    paymentMethod: "Card",
  },
  {
    id: "14",
    description: "Quarterly health check-up",
    category: "Health",
    amount: 110,
    date: "2025-01-30",
    paymentMethod: "Card",
  },
  {
    id: "15",
    description: "Water bill",
    category: "Utilities",
    amount: 56.2,
    date: "2025-02-15",
    paymentMethod: "Transfer",
  },
  {
    id: "16",
    description: "Concert tickets",
    category: "Personal",
    amount: 120,
    date: "2025-01-22",
    paymentMethod: "Card",
  },
  {
    id: "17",
    description: "Meal prep groceries",
    category: "Groceries",
    amount: 82.35,
    date: "2025-01-12",
    paymentMethod: "Card",
  },
  {
    id: "18",
    description: "Weekend brunch",
    category: "Dining",
    amount: 48.25,
    date: "2025-01-19",
    paymentMethod: "Card",
  },
  {
    id: "19",
    description: "Gas refill",
    category: "Transportation",
    amount: 54.8,
    date: "2025-02-04",
    paymentMethod: "Card",
  },
  {
    id: "20",
    description: "Savings top-up",
    category: "Savings",
    amount: 180,
    date: "2025-02-01",
    paymentMethod: "Transfer",
  },
];

const UPCOMING_BILLS = [
  {
    id: "u1",
    title: "Internet & Streaming",
    dueDate: "2025-03-18",
    amount: 84.99,
    autoPay: true,
  },
  {
    id: "u2",
    title: "Credit Card Minimum",
    dueDate: "2025-03-22",
    amount: 135,
    autoPay: false,
  },
  {
    id: "u3",
    title: "Health Insurance",
    dueDate: "2025-04-01",
    amount: 210,
    autoPay: true,
  },
];

const PAYMENT_METHODS: PaymentMethod[] = ["Card", "Cash", "Transfer"];

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const getMonthKey = (date: string) => {
  const current = new Date(date);
  return `${current.getFullYear()}-${current.getMonth() + 1}`;
};

const getMonthLabel = (key: string) => {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_LABELS[month - 1]} ${year}`;
};

const sortDescendingByDate = (a: Expense, b: Expense) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    [...INITIAL_EXPENSES].sort(sortDescendingByDate),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formState, setFormState] = useState({
    description: "",
    amount: "",
    date: "",
    category: CATEGORY_BUDGETS[0]?.category ?? "Housing",
    paymentMethod: PAYMENT_METHODS[0],
    recurring: false,
    notes: "",
  });
  const [formError, setFormError] = useState<string>("");

  const monthOptions = useMemo(() => {
    const uniqueKeys = new Set(expenses.map((expense) => getMonthKey(expense.date)));
    return Array.from(uniqueKeys)
      .sort((a, b) => (a > b ? -1 : 1))
      .map((key) => ({ key, label: getMonthLabel(key) }));
  }, [expenses]);

  const yearOptions = useMemo(() => {
    const years = new Set(expenses.map((expense) => new Date(expense.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const month = `${expenseDate.getMonth() + 1}`;
      const year = `${expenseDate.getFullYear()}`;
      const matchesMonth = selectedMonth === "all" || selectedMonth === month;
      const matchesYear = selectedYear === "all" || selectedYear === year;
      const matchesCategory =
        selectedCategory === "all" || expense.category === selectedCategory;
      const matchesSearch = searchTerm
        ? expense.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesMonth && matchesYear && matchesCategory && matchesSearch;
    });
  }, [expenses, selectedMonth, selectedYear, selectedCategory, searchTerm]);

  const totalSpent = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses],
  );

  const recurringSpent = useMemo(
    () =>
      filteredExpenses
        .filter((expense) => expense.recurring)
        .reduce((sum, expense) => sum + expense.amount, 0),
    [filteredExpenses],
  );

  const averageTransaction = useMemo(() => {
    if (filteredExpenses.length === 0) return 0;
    return totalSpent / filteredExpenses.length;
  }, [filteredExpenses.length, totalSpent]);

  const categoryBreakdown = useMemo(() => {
    const totals = CATEGORY_BUDGETS.reduce<Record<Category, number>>(
      (acc, { category }) => ({ ...acc, [category]: 0 }),
      {} as Record<Category, number>,
    );
    filteredExpenses.forEach((expense) => {
      totals[expense.category] += expense.amount;
    });
    return CATEGORY_BUDGETS.map(({ category, allocated }) => ({
      category,
      allocated,
      spent: totals[category],
    }));
  }, [filteredExpenses]);

  const busiestCategory = useMemo(() => {
    const sorted = [...categoryBreakdown]
      .sort((a, b) => b.spent - a.spent)
      .filter((item) => item.spent > 0);
    return sorted[0];
  }, [categoryBreakdown]);

  const monthlyTrend = useMemo(() => {
    const grouped = expenses.reduce<Record<string, number>>((acc, expense) => {
      const key = getMonthKey(expense.date);
      acc[key] = (acc[key] ?? 0) + expense.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-6)
      .map(([key, amount]) => ({ key, label: getMonthLabel(key), amount }));
  }, [expenses]);

  const handleFilterReset = () => {
    setSelectedMonth("all");
    setSelectedYear("all");
    setSelectedCategory("all");
    setSearchTerm("");
  };

  const handleAddExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = parseFloat(formState.amount);
    if (!formState.description.trim() || Number.isNaN(parsedAmount) || !formState.date) {
      setFormError("Please provide a description, date, and valid amount.");
      return;
    }
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: formState.description.trim(),
      category: formState.category as Category,
      amount: Math.round(parsedAmount * 100) / 100,
      date: formState.date,
      paymentMethod: formState.paymentMethod,
      recurring: formState.recurring,
      notes: formState.notes?.trim() || undefined,
    };

    setExpenses((current) => [newExpense, ...current].sort(sortDescendingByDate));
    setFormState((previous) => ({
      ...previous,
      description: "",
      amount: "",
      notes: "",
    }));
    setFormError("");
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      setFormState((current) => ({
        ...current,
        [name]: (event.target as HTMLInputElement).checked,
      }));
      return;
    }
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Personal Finance</p>
            <h1>Expense Intelligence Dashboard</h1>
            <p className={styles.subtitle}>
              Track your spending, monitor recurring costs, and stay aligned with
              your monthly budget in one place.
            </p>
          </div>
          <div className={styles.budgetCard}>
            <span>Monthly Budget</span>
            <strong>{formatCurrency(MONTHLY_BUDGET)}</strong>
            <p>
              {formatCurrency(MONTHLY_BUDGET - totalSpent)} remaining
              {selectedMonth !== "all" || selectedYear !== "all"
                ? " for selected period"
                : " this month"}
            </p>
          </div>
        </header>

        <section className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="month">Month</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              <option value="all">All</option>
              {monthOptions.map(({ key }) => {
                const [, month] = key.split("-");
                return (
                  <option key={key} value={month}>
                    {getMonthLabel(key)}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="year">Year</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              <option value="all">All</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="all">All</option>
              {CATEGORY_BUDGETS.map(({ category }) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Find an expense"
            />
          </div>
          <button className={styles.resetButton} onClick={handleFilterReset}>
            Reset
          </button>
        </section>

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <h2>Total Spent</h2>
            <strong>{formatCurrency(totalSpent)}</strong>
            <p>
              {filteredExpenses.length} transaction
              {filteredExpenses.length === 1 ? "" : "s"} in view
            </p>
          </article>
          <article className={styles.summaryCard}>
            <h2>Average Transaction</h2>
            <strong>{formatCurrency(averageTransaction || 0)}</strong>
            <p>Across filtered expenses</p>
          </article>
          <article className={styles.summaryCard}>
            <h2>Recurring Costs</h2>
            <strong>{formatCurrency(recurringSpent)}</strong>
            <p>
              {Math.round((recurringSpent / (totalSpent || 1)) * 100)}% of
              spending
            </p>
          </article>
          <article className={styles.summaryCard}>
            <h2>Top Category</h2>
            <strong>{busiestCategory?.category ?? "—"}</strong>
            <p>{busiestCategory ? formatCurrency(busiestCategory.spent) : "No data"}</p>
          </article>
        </section>

        <section className={styles.dashboardGrid}>
          <article className={styles.chartCard}>
            <header>
              <h2>Monthly Trend</h2>
              <span className={styles.helperText}>Recent six months</span>
            </header>
            <MonthlyTrendChart data={monthlyTrend} />
          </article>

          <article className={styles.chartCard}>
            <header>
              <h2>Category Allocation</h2>
              <span className={styles.helperText}>Budget vs. actual spend</span>
            </header>
            <div className={styles.categoryList}>
              {categoryBreakdown.map(({ category, allocated, spent }) => (
                <div key={category} className={styles.categoryRow}>
                  <div>
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryAmounts}>
                      {formatCurrency(spent)} / {formatCurrency(allocated)}
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min(Math.round((spent / allocated) * 100), 120)}
                  />
                  <span className={styles.progressValue}>
                    {Math.round((spent / allocated) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.formCard}>
            <header>
              <h2>Add New Expense</h2>
              <span className={styles.helperText}>
                Track spending the moment it happens
              </span>
            </header>
            <form className={styles.expenseForm} onSubmit={handleAddExpense}>
              <div className={styles.fieldGroup}>
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Lunch meeting"
                  required
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="amount">Amount</label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formState.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="categorySelect">Category</label>
                  <select
                    id="categorySelect"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    required
                  >
                    {CATEGORY_BUDGETS.map(({ category }) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="paymentMethod">Payment</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formState.paymentMethod}
                    onChange={handleInputChange}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formState.notes}
                  onChange={handleInputChange}
                  placeholder="Optional memo"
                />
              </div>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formState.recurring}
                  onChange={handleInputChange}
                />
                Mark as recurring expense
              </label>
              {formError && <p className={styles.formError}>{formError}</p>}
              <button type="submit" className={styles.submitButton}>
                Save Expense
              </button>
            </form>
          </article>

          <article className={styles.tableCard}>
            <header>
              <h2>Recent Activity</h2>
              <span className={styles.helperText}>Sorted by newest first</span>
            </header>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Category</th>
                    <th scope="col">Payment</th>
                    <th scope="col" className={styles.alignRight}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <span className={styles.description}>{expense.description}</span>
                        {expense.notes && (
                          <span className={styles.note}>{expense.notes}</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.categoryPill}>{expense.category}</span>
                        {expense.recurring && (
                          <span className={styles.recurringPill}>Recurring</span>
                        )}
                      </td>
                      <td>{expense.paymentMethod}</td>
                      <td className={styles.alignRight}>
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredExpenses.length === 0 && (
                <p className={styles.emptyState}>
                  No expenses match your filters. Try broadening the criteria.
                </p>
              )}
            </div>
          </article>

          <article className={styles.chartCard}>
            <header>
              <h2>Upcoming Bills</h2>
              <span className={styles.helperText}>
                Stay ahead of scheduled payments
              </span>
            </header>
            <ul className={styles.upcomingList}>
              {UPCOMING_BILLS.map((bill) => (
                <li key={bill.id}>
                  <div>
                    <strong>{bill.title}</strong>
                    <span className={styles.helperText}>
                      Due {new Date(bill.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className={styles.upcomingMeta}>
                    <span>{formatCurrency(bill.amount)}</span>
                    <span
                      className={bill.autoPay ? styles.autoPay : styles.manualPay}
                    >
                      {bill.autoPay ? "Auto-pay" : "Manual"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}

type TrendPoint = { key: string; label: string; amount: number };

function MonthlyTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return <p className={styles.emptyState}>Add expenses to build your history.</p>;
  }

  const maxValue = Math.max(...data.map((point) => point.amount), 1);
  const chartHeight = 160;
  const chartWidth = 100 * data.length;

  return (
    <svg
      className={styles.trendChart}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label="Monthly spending trend"
    >
      {data.map((point, index) => {
        const x = index * 100 + 20;
        const height = (point.amount / maxValue) * (chartHeight - 40);
        const y = chartHeight - height - 20;
        return (
          <g key={point.key}>
            <rect
              x={x}
              y={y}
              width={60}
              height={height}
              rx={14}
              className={styles.trendBar}
            />
            <text x={x + 30} y={y - 12} className={styles.trendValue}>
              {formatCurrency(point.amount)}
            </text>
            <text x={x + 30} y={chartHeight - 5} className={styles.trendLabel}>
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(value, 130));
  return (
    <span className={styles.progressBar}>
      <span
        className={styles.progressFill}
        style={{
          width: `${safeValue}%`,
          backgroundColor: safeValue > 100 ? "#f87171" : undefined,
        }}
      />
    </span>
  );
}
