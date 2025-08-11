// Google Apps Script สำหรับ HUDANOOR ระบบบันทึกรายรับ-รายจ่าย
// คัดลอกโค้ดนี้ไปใส่ใน Google Apps Script Editor
// แก้ไข SPREADSHEET_ID ให้ตรงกับ Google Sheets ของคุณ

// ตั้งค่า Spreadsheet ID - แก้ไขให้ตรงกับของคุณ
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// ชื่อ Sheet
var INCOME_SHEET = 'รายรับ';
var EXPENSE_SHEET = 'รายจ่าย';

// Headers สำหรับ Income Sheet
var INCOME_HEADERS = [
  'ID', 'วันที่', 'ช่องทาง', 'สาขา/แพลตฟอร์ม', 'ชื่อสินค้า', 
  'หมวดหมู่สินค้า', 'จำนวน', 'ยอดเงิน', 'หมายเหตุ', 'สร้างเมื่อ', 'แก้ไขเมื่อ'
];

// Headers สำหรับ Expense Sheet
var EXPENSE_HEADERS = [
  'ID', 'วันที่', 'ช่องทาง', 'สาขา/แพลตฟอร์ม', 'รายการค่าใช้จ่าย', 
  'หมวดหมู่ค่าใช้จ่าย', 'ยอดเงิน', 'หมายเหตุ', 'สร้างเมื่อ', 'แก้ไขเมื่อ'
];

// ฟังก์ชันหลักสำหรับ HTTP GET
function doGet(e) {
  var action = e.parameter.action;
  var callback = e.parameter.callback;
  
  try {
    var result;
    switch (action) {
      case 'getIncome':
        result = getIncomeData(callback);
        break;
      case 'getExpense':
        result = getExpenseData(callback);
        break;
      case 'addIncome':
        var incomeData = JSON.parse(e.parameter.data);
        result = addIncomeRecord(incomeData, callback);
        break;
      case 'addExpense':
        var expenseData = JSON.parse(e.parameter.data);
        result = addExpenseRecord(expenseData, callback);
        break;
      case 'initializeSheets':
        result = initializeSheets(callback);
        break;
      default:
        var errorResult = { error: 'Invalid action' };
        if (callback) {
          result = ContentService
            .createTextOutput(callback + '(' + JSON.stringify(errorResult) + ');')
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
        } else {
          result = ContentService
            .createTextOutput(JSON.stringify(errorResult))
            .setMimeType(ContentService.MimeType.JSON);
        }
    }
    
    return result;
  } catch (error) {
    var errorResult = { error: error.toString() };
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(errorResult) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify(errorResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

// ฟังก์ชันหลักสำหรับ HTTP POST
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    var result;
    switch (action) {
      case 'addIncome':
        result = addIncomeRecord(data.data);
        break;
      case 'addExpense':
        result = addExpenseRecord(data.data);
        break;
      case 'initializeSheets':
        result = initializeSheets();
        break;
      default:
        result = ContentService
          .createTextOutput(JSON.stringify({ error: 'Invalid action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    // เพิ่ม CORS headers
    return result.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// จัดการ OPTIONS request สำหรับ CORS preflight
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// อ่านข้อมูลรายรับ
function getIncomeData(callback) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(INCOME_SHEET);
  
  if (!sheet) {
    throw new Error('Sheet "' + INCOME_SHEET + '" not found');
  }
  
  var values = sheet.getDataRange().getValues();
  var result = { values: values };
  
  if (callback) {
    // JSONP response
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Regular JSON response
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// อ่านข้อมูลรายจ่าย
function getExpenseData(callback) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(EXPENSE_SHEET);
  
  if (!sheet) {
    throw new Error('Sheet "' + EXPENSE_SHEET + '" not found');
  }
  
  var values = sheet.getDataRange().getValues();
  var result = { values: values };
  
  if (callback) {
    // JSONP response
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Regular JSON response
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// เพิ่มข้อมูลรายรับ
function addIncomeRecord(incomeData, callback) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(INCOME_SHEET);
  
  if (!sheet) {
    throw new Error('Sheet "' + INCOME_SHEET + '" not found');
  }
  
  var id = 'income_' + Date.now();
  var now = new Date().toISOString();
  
  var rowData = [
    id,
    incomeData.date,
    incomeData.channel,
    incomeData.branch_or_platform,
    incomeData.product_name,
    incomeData.product_category,
    incomeData.quantity,
    incomeData.amount,
    incomeData.note || '',
    now,
    now
  ];
  
  sheet.appendRow(rowData);
  
  var result = { success: true, id: id };
  
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// เพิ่มข้อมูลรายจ่าย
function addExpenseRecord(expenseData, callback) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(EXPENSE_SHEET);
  
  if (!sheet) {
    throw new Error('Sheet "' + EXPENSE_SHEET + '" not found');
  }
  
  var id = 'expense_' + Date.now();
  var now = new Date().toISOString();
  
  var rowData = [
    id,
    expenseData.date,
    expenseData.channel,
    expenseData.branch_or_platform,
    expenseData.expense_item,
    expenseData.expense_category,
    expenseData.cost,
    expenseData.note || '',
    now,
    now
  ];
  
  sheet.appendRow(rowData);
  
  var result = { success: true, id: id };
  
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ตั้งค่า Headers ใน Sheets
function initializeSheets(callback) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // สร้างหรือตั้งค่า Income Sheet
  var incomeSheet = spreadsheet.getSheetByName(INCOME_SHEET);
  if (!incomeSheet) {
    incomeSheet = spreadsheet.insertSheet(INCOME_SHEET);
  }
  
  // ตั้งค่า Headers สำหรับ Income Sheet
  var incomeRange = incomeSheet.getRange(1, 1, 1, INCOME_HEADERS.length);
  incomeRange.setValues([INCOME_HEADERS]);
  incomeRange.setFontWeight('bold');
  incomeRange.setBackground('#f0f0f0');
  
  // สร้างหรือตั้งค่า Expense Sheet
  var expenseSheet = spreadsheet.getSheetByName(EXPENSE_SHEET);
  if (!expenseSheet) {
    expenseSheet = spreadsheet.insertSheet(EXPENSE_SHEET);
  }
  
  // ตั้งค่า Headers สำหรับ Expense Sheet
  var expenseRange = expenseSheet.getRange(1, 1, 1, EXPENSE_HEADERS.length);
  expenseRange.setValues([EXPENSE_HEADERS]);
  expenseRange.setFontWeight('bold');
  expenseRange.setBackground('#f0f0f0');
  
  var result = { success: true, message: 'Sheets initialized successfully' };
  
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}