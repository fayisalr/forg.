"use server";

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- WEBSITE / CONTENT SETTINGS ---

export async function getHomeConfig() {
  try {
    const res = await query("SELECT value FROM settings WHERE key = 'home_config'");
    if (res.rows.length > 0) {
      return res.rows[0].value;
    }
    return null;
  } catch (err) {
    console.error("Error fetching home config:", err);
    return null;
  }
}

export async function saveHomeConfig(config: any) {
  try {
    await query(`
      INSERT INTO settings (key, value)
      VALUES ('home_config', $1)
      ON CONFLICT (key) DO UPDATE SET value = $1
    `, [config]);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error("Error saving home config:", err);
    return { success: false, error: String(err) };
  }
}

export async function getContactConfig() {
  try {
    const res = await query("SELECT value FROM settings WHERE key = 'contact_config'");
    if (res.rows.length > 0) {
      return res.rows[0].value;
    }
    return null;
  } catch (err) {
    console.error("Error fetching contact config:", err);
    return null;
  }
}

export async function saveContactConfig(config: any) {
  try {
    await query(`
      INSERT INTO settings (key, value)
      VALUES ('contact_config', $1)
      ON CONFLICT (key) DO UPDATE SET value = $1
    `, [config]);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error("Error saving contact config:", err);
    return { success: false, error: String(err) };
  }
}

// --- SERVICES ---

export async function getServices() {
  try {
    const res = await query("SELECT * FROM services ORDER BY created_at ASC");
    return res.rows;
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
}

export async function addService(title: string, description: string, icon: string = 'Camera') {
  try {
    const res = await query(`
      INSERT INTO services (title, description, icon, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `, [title, description, icon]);
    revalidatePath('/services');
    return { success: true, service: res.rows[0] };
  } catch (err) {
    console.error("Error adding service:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteService(id: string) {
  try {
    await query("DELETE FROM services WHERE id = $1", [id]);
    revalidatePath('/services');
    return { success: true };
  } catch (err) {
    console.error("Error deleting service:", err);
    return { success: false, error: String(err) };
  }
}

// --- PORTFOLIO ---

export async function getPortfolio() {
  try {
    const res = await query("SELECT * FROM portfolio ORDER BY created_at DESC");
    return res.rows;
  } catch (err) {
    console.error("Error fetching portfolio:", err);
    return [];
  }
}

export async function addPortfolio(title: string, type: 'photo' | 'video', url: string, is_public: boolean = true) {
  try {
    const res = await query(`
      INSERT INTO portfolio (title, type, url, is_public)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, type, url, is_public]);
    revalidatePath('/portfolio');
    return { success: true, item: res.rows[0] };
  } catch (err) {
    console.error("Error adding portfolio:", err);
    return { success: false, error: String(err) };
  }
}

export async function deletePortfolio(id: string) {
  try {
    await query("DELETE FROM portfolio WHERE id = $1", [id]);
    revalidatePath('/portfolio');
    return { success: true };
  } catch (err) {
    console.error("Error deleting portfolio:", err);
    return { success: false, error: String(err) };
  }
}

// --- CLIENTS ---

export async function getClients() {
  try {
    const res = await query("SELECT * FROM clients ORDER BY created_at DESC");
    return res.rows;
  } catch (err) {
    console.error("Error fetching clients:", err);
    return [];
  }
}

export async function addClient(data: {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  gstIn?: string;
  creditTerms?: string;
  totalInvoiced?: number;
  totalPaid?: number;
  status?: string;
}) {
  try {
    const res = await query(`
      INSERT INTO clients (company, name, email, phone, address, gst_in, credit_terms, total_invoiced, total_paid, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      data.company,
      data.contactName,
      data.email,
      data.phone,
      data.address || '',
      data.gstIn || '',
      data.creditTerms || 'Net 30',
      data.totalInvoiced || 0,
      data.totalPaid || 0,
      data.status || 'Unpaid'
    ]);
    return { success: true, client: res.rows[0] };
  } catch (err) {
    console.error("Error adding client:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateClient(id: string, data: {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  gstIn?: string;
  creditTerms?: string;
  totalInvoiced?: number;
  totalPaid?: number;
  status?: string;
}) {
  try {
    const res = await query(`
      UPDATE clients
      SET company = $1, name = $2, email = $3, phone = $4, address = $5, gst_in = $6, credit_terms = $7, total_invoiced = $8, total_paid = $9, status = $10
      WHERE id = $11
      RETURNING *
    `, [
      data.company,
      data.contactName,
      data.email,
      data.phone,
      data.address || '',
      data.gstIn || '',
      data.creditTerms || 'Net 30',
      data.totalInvoiced || 0,
      data.totalPaid || 0,
      data.status || 'Unpaid',
      id
    ]);
    return { success: true, client: res.rows[0] };
  } catch (err) {
    console.error("Error updating client:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteClient(id: string) {
  try {
    await query("DELETE FROM clients WHERE id = $1", [id]);
    return { success: true };
  } catch (err) {
    console.error("Error deleting client:", err);
    return { success: false, error: String(err) };
  }
}

// --- PROJECTS ---

export async function getProjects() {
  try {
    const res = await query(`
      SELECT p.*, c.company as client_company, c.name as client_name
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
    `);
    return res.rows;
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

export async function addProject(data: {
  title: string;
  description?: string;
  client_id?: string | null;
  status?: string;
  start_date?: string;
  end_date?: string;
}) {
  try {
    const res = await query(`
      INSERT INTO projects (title, description, client_id, status, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      data.title,
      data.description || '',
      data.client_id || null,
      data.status || 'pending',
      data.start_date || null,
      data.end_date || null
    ]);
    return { success: true, project: res.rows[0] };
  } catch (err) {
    console.error("Error adding project:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateProject(id: string, data: {
  title: string;
  description?: string;
  client_id?: string | null;
  status?: string;
  start_date?: string;
  end_date?: string;
}) {
  try {
    const res = await query(`
      UPDATE projects
      SET title = $1, description = $2, client_id = $3, status = $4, start_date = $5, end_date = $6
      WHERE id = $7
      RETURNING *
    `, [
      data.title,
      data.description || '',
      data.client_id || null,
      data.status || 'pending',
      data.start_date || null,
      data.end_date || null,
      id
    ]);
    return { success: true, project: res.rows[0] };
  } catch (err) {
    console.error("Error updating project:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteProject(id: string) {
  try {
    await query("DELETE FROM projects WHERE id = $1", [id]);
    return { success: true };
  } catch (err) {
    console.error("Error deleting project:", err);
    return { success: false, error: String(err) };
  }
}

// --- STAFF / PROFILES ---

export async function getProfiles() {
  try {
    const res = await query("SELECT * FROM profiles ORDER BY created_at DESC");
    return res.rows;
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return [];
  }
}

export async function getProfileByEmail(email: string) {
  try {
    const res = await query(`
      SELECT p.*, u.email
      FROM profiles p
      JOIN auth.users u ON p.id = u.id
      WHERE u.email = $1
    `, [email]);
    if (res.rows.length > 0) {
      return res.rows[0];
    }
    return null;
  } catch (err) {
    console.error("Error fetching profile by email:", err);
    return null;
  }
}

// --- TASKS ---

export async function getTasks(userEmail?: string) {
  try {
    let email = userEmail;
    if (!email) {
      const cookieStore = await cookies();
      email = cookieStore.get('forg_user_email')?.value;
    }

    let q = `
      SELECT t.*, pr.title as project_title, prof.name as assigned_name
      FROM tasks t
      LEFT JOIN projects pr ON t.project_id = pr.id
      LEFT JOIN profiles prof ON t.assigned_to = prof.id
    `;
    const params = [];
    if (email) {
      const profile = await getProfileByEmail(email);
      if (profile) {
        q += ` WHERE t.assigned_to = $1`;
        params.push(profile.id);
      }
    }
    q += ` ORDER BY t.created_at DESC`;
    const res = await query(q, params);
    return res.rows;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}

export async function addTask(data: {
  title: string;
  description?: string;
  project_id?: string | null;
  assigned_to?: string | null;
  status?: string;
  due_date?: string;
  priority?: string;
}) {
  try {
    const res = await query(`
      INSERT INTO tasks (title, description, project_id, assigned_to, status, due_date, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      data.title,
      data.description || '',
      data.project_id || null,
      data.assigned_to || null,
      data.status || 'pending',
      data.due_date || null,
      data.priority || 'Medium'
    ]);
    return { success: true, task: res.rows[0] };
  } catch (err) {
    console.error("Error adding task:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    const res = await query(`
      UPDATE tasks
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    return { success: true, task: res.rows[0] };
  } catch (err) {
    console.error("Error updating task status:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteTask(id: string) {
  try {
    await query("DELETE FROM tasks WHERE id = $1", [id]);
    return { success: true };
  } catch (err) {
    console.error("Error deleting task:", err);
    return { success: false, error: String(err) };
  }
}

// --- DAILY UPDATES ---

export async function getDailyUpdates() {
  try {
    const res = await query(`
      SELECT d.*, p.name as staff_name
      FROM daily_updates d
      JOIN profiles p ON d.staff_id = p.id
      ORDER BY d.date DESC, d.created_at DESC
    `);
    return res.rows;
  } catch (err) {
    console.error("Error fetching daily updates:", err);
    return [];
  }
}

export async function addDailyUpdate(email?: string, updateText?: string, hoursWorked?: number) {
  try {
    let userEmail = email;
    if (!userEmail) {
      const cookieStore = await cookies();
      userEmail = cookieStore.get('forg_user_email')?.value;
    }

    if (!userEmail) {
      return { success: false, error: "No user email found" };
    }

    const profile = await getProfileByEmail(userEmail);
    if (!profile) {
      return { success: false, error: "Profile not found for " + userEmail };
    }

    const res = await query(`
      INSERT INTO daily_updates (staff_id, update_text, hours_worked, date)
      VALUES ($1, $2, $3, current_date)
      RETURNING *
    `, [profile.id, updateText || '', hoursWorked || 0]);
    return { success: true, update: res.rows[0] };
  } catch (err) {
    console.error("Error adding daily update:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteDailyUpdate(id: string) {
  try {
    await query("DELETE FROM daily_updates WHERE id = $1", [id]);
    return { success: true };
  } catch (err) {
    console.error("Error deleting daily update:", err);
    return { success: false, error: String(err) };
  }
}

// --- FINANCES & LEDGER ---

export async function getFinances() {
  try {
    const incomesRes = await query(`
      SELECT i.*, p.title as project_title, c.company as client_company
      FROM incomes i
      LEFT JOIN projects p ON i.project_id = p.id
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY i.date DESC, i.created_at DESC
    `);
    const expensesRes = await query(`
      SELECT * FROM expenses
      ORDER BY date DESC, created_at DESC
    `);
    return {
      incomes: incomesRes.rows,
      expenses: expensesRes.rows
    };
  } catch (err) {
    console.error("Error fetching finances:", err);
    return { incomes: [], expenses: [] };
  }
}

export async function addTransaction(data: {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  project_id?: string | null;
  date?: string;
  entity: string;
  status?: string;
}) {
  try {
    const txDate = data.date || new Date().toISOString().split('T')[0];
    if (data.type === 'income') {
      const res = await query(`
        INSERT INTO incomes (project_id, amount, date, description, entity, status, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [data.project_id || null, data.amount, txDate, data.description, data.entity, data.status || 'Completed', data.category || 'Project Revenue']);
      return { success: true, transaction: { ...res.rows[0], type: 'income' } };
    } else {
      const res = await query(`
        INSERT INTO expenses (amount, date, description, category, entity, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [data.amount, txDate, data.description, data.category || 'General', data.entity, data.status || 'Completed']);
      return { success: true, transaction: { ...res.rows[0], type: 'expense' } };
    }
  } catch (err) {
    console.error("Error adding transaction:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const resIncome = await query("DELETE FROM incomes WHERE id = $1 RETURNING id", [id]);
    if (resIncome.rows.length > 0) {
      return { success: true };
    }
    await query("DELETE FROM expenses WHERE id = $1", [id]);
    return { success: true };
  } catch (err) {
    console.error("Error deleting transaction:", err);
    return { success: false, error: String(err) };
  }
}

// --- INVOICES ---

export async function getInvoices() {
  try {
    const invoicesRes = await query(`
      SELECT i.*, c.company as client_company, c.name as client_name
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      ORDER BY i.created_at DESC
    `);
    return invoicesRes.rows;
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return [];
  }
}

export async function addInvoice(data: {
  client_id: string;
  status?: string;
  due_date?: string;
  total_amount?: number;
}) {
  try {
    const res = await query(`
      INSERT INTO invoices (client_id, status, issue_date, due_date, total_amount)
      VALUES ($1, $2, current_date, $3, $4)
      RETURNING *
    `, [
      data.client_id,
      data.status || 'draft',
      data.due_date || null,
      data.total_amount || 0
    ]);
    return { success: true, invoice: res.rows[0] };
  } catch (err) {
    console.error("Error adding invoice:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    const res = await query(`
      UPDATE invoices
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    return { success: true, invoice: res.rows[0] };
  } catch (err) {
    console.error("Error updating invoice status:", err);
    return { success: false, error: String(err) };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await query("DELETE FROM invoices WHERE id = $1", [id]);
    return { success: true };
  } catch (err) {
    console.error("Error deleting invoice:", err);
    return { success: false, error: String(err) };
  }
}

// --- DASHBOARD AGGREGATES ---

export async function getAdminDashboardStats() {
  try {
    const activeProjects = await query("SELECT count(*) FROM projects WHERE status = 'active'");
    const totalClients = await query("SELECT count(*) FROM clients");
    const pendingInvoices = await query("SELECT COALESCE(sum(total_amount), 0) as amount FROM invoices WHERE status != 'paid'");
    const monthlyRevenue = await query(`
      SELECT COALESCE(sum(amount), 0) as amount 
      FROM incomes 
      WHERE date >= current_date - interval '30 days'
    `);

    const recentProjects = await query(`
      SELECT p.*, c.company as client_company
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 3
    `);

    const staffActivity = await query(`
      SELECT d.*, p.name as staff_name
      FROM daily_updates d
      JOIN profiles p ON d.staff_id = p.id
      ORDER BY d.created_at DESC
      LIMIT 3
    `);

    return {
      stats: [
        { label: "Active Projects", value: activeProjects.rows[0].count },
        { label: "Total Clients", value: totalClients.rows[0].count },
        { label: "Pending Invoices", value: "₹" + parseFloat(pendingInvoices.rows[0].amount).toLocaleString() },
        { label: "Monthly Revenue", value: "₹" + parseFloat(monthlyRevenue.rows[0].amount).toLocaleString() }
      ],
      recentProjects: recentProjects.rows,
      staffActivity: staffActivity.rows
    };
  } catch (err) {
    console.error("Error getting admin stats:", err);
    return {
      stats: [
        { label: "Active Projects", value: "0" },
        { label: "Total Clients", value: "0" },
        { label: "Pending Invoices", value: "₹0" },
        { label: "Monthly Revenue", value: "₹0" }
      ],
      recentProjects: [],
      staffActivity: []
    };
  }
}
