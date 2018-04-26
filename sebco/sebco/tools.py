from __future__ import unicode_literals
import frappe
import json
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt, today, getdate, add_years
from frappe.model.document import Document


@frappe.whitelist()
def rename_activity_type(doc, method):
    for at in doc.activity_type:
        print " doc.name = doc.activity_type = {}".format(doc.activity_type)
        if doc.name not in at.activity_type:
            
            at.activity_type = doc.name +"-"+ at.activity_type
            print "at.activity_type = {}".format(at.activity_type)
    # doc.save()
    # print "activity_type = {}".format(frappe.as_json(doc.activity_type))
