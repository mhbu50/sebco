from __future__ import unicode_literals
import frappe
import json
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt, today, getdate, add_years
from frappe.model.document import Document
from frappe.desk.notifications import get_filters_for


@frappe.whitelist()
def rename_activity_type(doc, method):
    for at in doc.activity_type:
        # print "\n 1 doc.activity_type = {} \n".format(frappe.as_json(doc.activity_type))
        if doc.name not in at.activity_type:
            at.name = doc.name +"-"+ at.activity_type
            at.activity_type = doc.name +"-"+ at.activity_type
            # print "at.activity_type = {}".format(at.activity_type)
            # print " 2 activity_type = {}".format(frappe.as_json(doc.activity_type))

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
        #return fieldname
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
