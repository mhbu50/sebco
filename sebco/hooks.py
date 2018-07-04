# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "sebco"
app_title = "Sebco"
app_publisher = "Accurate Systems"
app_description = "sebco app"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@accuratesystems.com.sa"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/sebco/css/sebco.css"
# app_include_js = "/assets/sebco/js/sebco.js"

# include js, css files in header of web template
# web_include_css = "/assets/sebco/css/sebco.css"
# web_include_js = "/assets/sebco/js/sebco.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Sales Order" : "public/js/sales_order.js",
"Sales Invoice" : "public/js/sales_invoice.js",
"Project" : "public/js/project.js",
"Quotation" : "public/js/quotation.js",
"Timesheet" : "public/js/timesheet.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "sebco.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "sebco.install.before_install"
# after_install = "sebco.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sebco.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"Sales Order": {
# 		"validate": "sebco.sebco.tools.rename_activity_type",
#
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"sebco.tasks.all"
# 	],
# 	"daily": [
# 		"sebco.tasks.daily"
# 	],
# 	"hourly": [
# 		"sebco.tasks.hourly"
# 	],
# 	"weekly": [
# 		"sebco.tasks.weekly"
# 	]
# 	"monthly": [
# 		"sebco.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "sebco.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "sebco.event.get_events"
# }
