from __future__ import unicode_literals
import frappe
import json
from frappe import _
from erpnext import get_default_company
from frappe.model.document import Document
from frappe.utils import flt, today, getdate, add_years
from frappe.model.document import Document
from frappe.desk.notifications import get_filters_for


@frappe.whitelist()
def get_open_count(doctype, name, links):
	'''Get open count for given transactions and filters

	:param doctype: Reference DocType
	:param name: Reference Name
	:param transactions: List of transactions (json/dict)
	:param filters: optional filters (json/list)'''

	frappe.has_permission(doc=frappe.get_doc(doctype, name), throw=True)

	meta = frappe.get_meta(doctype)
	links = meta.get_dashboard_data()

	links = frappe._dict({
		'fieldname': 'project',
		'transactions': [
			{
				'label': _('Quotation'),
				'items': ['Quotation']
			},
		]
	})
	# frappe.msgprint(str(links))

	# compile all items in a list
	items = []
	for group in links.transactions:
		items.extend(group.get('items'))

	out = []
	for d in items:
		if d in links.get('internal_links', {}):
			# internal link
			continue

		filters = get_filters_for(d)
		fieldname = links.get('non_standard_fieldnames', {}).get(d, links.fieldname)

		data = {'name': d}
		if filters:
			# get the fieldname for the current document
			# we only need open documents related to the current document
			filters[fieldname] = name
			total = len(frappe.get_all(d, fields='name',
				filters=filters, limit=100, distinct=True, ignore_ifnull=True))
			data['open_count'] = total

		total = len(frappe.get_all(d, fields='name',
			filters={fieldname: name}, limit=100, distinct=True, ignore_ifnull=True))
		data['count'] = total
		out.append(data)

	out = {
		'count': out,
	}

	module = frappe.get_meta_module(doctype)
	if hasattr(module, 'get_timeline_data'):
		out['timeline_data'] = module.get_timeline_data(doctype, name)

	return out

def get_timesheets(start, end):
	timesheets = frappe.get_list("Timesheet", fields=["*"], filters={"docstatus":"1",
		"month_date": ["between", [start, end]]})
	return timesheets

@frappe.whitelist()
def add_overtime_to_salaryslip(posting_date, start, end):
	timesheets = get_timesheets(start, end)
	# 	print "timesheets = {}".format(frappe.as_json(timesheets))
	for t in timesheets:
		print "t.employee = {}".format(t.employee)
		ss = (frappe.get_list("Salary Slip", fields=["*"], filters={
			"posting_date": posting_date, "status": "draft", "employee": t.employee}) or [None])[0]
		print "\nss name = {}".format(frappe.as_json(ss))
		if ss:

			# print "\n\n t.overtime_total = {}".format(t.overtime_total)
			# print "\n\nt = {}".format(frappe.as_json(t))
			timesheet = frappe.get_doc("Timesheet",t.name)
			#print "timesheet.name = {}".format(frappe.as_json(timesheet.name))

			earning = frappe.get_list("Timesheet Addition", fields=["*"],filters = [["timesheet","=",timesheet.name],["flag","not in",["1"]]])
			print "earning = {}".format(frappe.as_json(earning))
			#print "ss.name  = {}".format(ss.name)
			#print "salary 1 = {}".format(frappe.as_json(salary))
			salary = frappe.get_doc("Salary Slip", ss.name)
			#add overtime
			if t.overtime_total:
				ot = frappe.get_doc({"doctype": "Salary Detail","salary_component": "Over Time", "amount": t.overtime_total})
				salary.append("earnings", ot)
				salary.overtime_hours = t.overtime_hours
				salary.overtime_rate = t.overtime_rate
				salary.save()
				frappe.db.sql("update `tabTimesheet Addition` set flag = 1 where name=%s", ot.name)
			# add Absent
			if t.absent_total:
				at = frappe.get_doc({"doctype": "Salary Detail","salary_component": "Absent", "amount": t.absent_total})
				salary.append("deductions", at)
				salary.absent_days = t.absent_days
				salary.absent_rate = t.absent_rate
				salary.save()
				frappe.db.sql("update `tabTimesheet Addition` set flag = 1 where name=%s", at.name)

			for e in earning:
				sd1 = frappe.get_doc({"doctype": "Salary Detail","salary_component": e.salary_component, "amount": e.amount})
				salary.append("earnings", sd1)
				salary.save()
				#flag Timesheet Addition
				frappe.db.sql("update `tabTimesheet Addition` set flag = 1 where name=%s", e.name)

			deduction = frappe.get_list("Timesheet Deduction", fields=["*"],filters = [["timesheet","=",timesheet.name],["flag","not in",["1"]]])
			print "deduction = {}".format(frappe.as_json(deduction))
			for d in deduction:
				sd2 = frappe.get_doc({"doctype": "Salary Detail","salary_component": d.salary_component, "amount": d.amount})
				salary.append("deductions", sd2)
				#print "salary 2 = {}".format(frappe.as_json(salary))
				salary.save()
				#flag Timesheet Deduction
				frappe.db.sql("update `tabTimesheet Deduction` set flag = 1 where name=%s", d.name)

			frappe.db.commit()
	#from frappe.sessions import clear_cache
	#	clear_cache('Salary Slip')
	#frappe.reload_doctype('Salary Slip')
	frappe.msgprint(_("OverTime/Absents are added to all Salary Slips"))

def before_insert_item(doc, method):
	frappe.get_doc({
	"doctype": "Activity Type",
	"activity_type": doc.item_code}).save()

def disabled_agreemnt_po():
	#Agreement
	agreements = frappe.get_list("Agreement",filters={"end_date":today,"status":"Active"},fields=["*"])
	for a in agreements:
		frappe.set_value(a.doctype, a.name, 'status','Disabled')
	#Customer PO
	customer_pos = frappe.get_list("Customer PO",filters={"end_date":today,"status":"Active"},fields=["*"])
	for po in customer_pos:
		frappe.set_value(po.doctype, po.name, 'status','Disabled')

def get_last_number(parent_account):
	last_acct_num = frappe.get_all('Account',fields=['account_number'], filters={'parent_account': parent_account,'is_group':0},order_by='account_number desc', limit=1)[0]['account_number']
	return last_acct_num

def create_customer_account(doc, method):
	last_number = get_last_number("003 - Customer account - S")
	new_number = int(last_number[-4:])+1
	account = frappe.get_doc({
		"doctype": "Account",
		"account_name": doc.customer_name,
		"account_number":"003"+str("{0:0>4}".format(new_number)),
		"parent_account":"003 - Customer account - S",
		"company": get_default_company(),
		"is_group": 0,
		"account_type": "Receivable",
	}).insert()

	account_party = frappe.get_doc({
		"doctype": "Party Account",
		"company": get_default_company(),
		"account":account.account_number+ " - " + account.account_name +" - S"
	})

	doc.append("accounts", account_party)
	doc.customer_number="003"+str("{0:0>4}".format(new_number)),
	doc.save()

def create_supplier_account(doc, method):
	last_number = get_last_number("004 - Supplier account - S")
	new_number = int(last_number[-4:])+1
	account = frappe.get_doc({
		"doctype": "Account",
		"account_name": doc.supplier_name,
		"account_number":"4"+str("{0:0>4}".format(new_number)),
		"parent_account":"004 - Supplier account - S",
		"company": get_default_company(),
		"is_group": 0,
		"account_type": "Payable",
	}).insert()

	account_party = frappe.get_doc({
		"doctype": "Party Account",
		"company": get_default_company(),
		"account":account.account_number+ " - " + account.account_name +" - S"
	})

	doc.append("accounts", account_party)
	doc.save()

def create_employee_account(doc, method):
	print "\n\n\n create_employee_account\n\n\n"
	last_number = get_last_number("005 - Employee account - S")
	new_number = int(last_number[-4:])+1
	account = frappe.get_doc({
		"doctype": "Account",
		"account_name": doc.employee_name,
		"account_number":"005"+str("{0:0>4}".format(new_number)),
		"parent_account":"005 - Employee account - S",
		"company": get_default_company(),
		"is_group": 0
		# "account_type": "Payable",
	}).insert()

	account_party = frappe.get_doc({
		"doctype": "Party Account",
		"company": get_default_company(),
		"account":account.account_number+ " - " + account.account_name +" - S"
	})

	doc.append("accounts", account_party)
	doc.employee_number="005"+str("{0:0>4}".format(new_number)),
	doc.save()
