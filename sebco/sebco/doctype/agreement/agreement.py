# -*- coding: utf-8 -*-
# Copyright (c) 2018, Accurate Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Agreement(Document):
	def before_insert(self):
		frappe.get_doc({
	        "doctype": "Project",
	        "project_name": self.customer,
	        "status": "Open",
	    }).save()
