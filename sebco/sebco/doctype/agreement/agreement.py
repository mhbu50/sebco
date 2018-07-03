# -*- coding: utf-8 -*-
# Copyright (c) 2018, Accurate Systems and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Agreement(Document):
	def after_insert(self):
		frappe.get_doc({
	        "doctype": "Project",
	        "project_name": self.customer,
	        "status": "Open",
			"customer":self.customer,
			"agreement":self.name,
			"expected_start_date":self.start_date,
			"expected_end_date":self.end_date
	    }).save()
