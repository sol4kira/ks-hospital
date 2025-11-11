const submitbtn = document.getElementById('submitbtn');

const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const doctorSelect = document.getElementById('doctor');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const reasonInput = document.getElementById('reason'); 
const nameInput = document.getElementById('name'); 

function cutWhiteSpace(text){return(text ||'').trim();}


const doctor= doctorSelect.value;

function isValidDate(dateString) {
    console.log('=== DATE VALIDATION DEBUG ===');
    console.log('Input date string:', dateString);
    
    let month, day, year, parsedDate;
    
    // Check if it's yyyy-mm-dd format (from HTML date input)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        console.log('📅 Detected yyyy-mm-dd format');
        const parts = dateString.split('-');
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
        parsedDate = new Date(year, month - 1, day);
    }
    // Check if it's mm/dd/yyyy format
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        console.log('📅 Detected mm/dd/yyyy format');
        const parts = dateString.split('/');
        month = parseInt(parts[0], 10);
        day = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
        parsedDate = new Date(year, month - 1, day);
    }
    else {
        console.log('❌ FAIL: Invalid date format');
        return false;
    }
    
    console.log('Parsed - Month:', month, 'Day:', day, 'Year:', year);
    console.log('Parsed date object:', parsedDate);
    
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
        console.log('❌ FAIL: Invalid date');
        return false;
    }
    
    // Check if parsed components match input
    if (parsedDate.getFullYear() !== year || 
        parsedDate.getMonth() + 1 !== month || 
        parsedDate.getDate() !== day) {
        console.log('❌ FAIL: Date components dont match');
        return false;
    }
    
    console.log('✅ PASS: Date is valid');
    
    // Check date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 15);
    
    console.log('Today:', today);
    console.log('Max allowed date (15 days from today):', maxDate);
    console.log('Input date:', parsedDate);
    
    const isInRange = parsedDate >= today && parsedDate <= maxDate;
    console.log('Is in range?', isInRange);
    
    return isInRange;
}

function isValidTime(time) {
    // Support both 24h (14:30) and 12h (2:30 PM) formats
    const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
    const match = time.trim().toUpperCase().match(timePattern);
    
    if (!match) return false;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3];
    
    // Validate minutes
    if (minutes < 0 || minutes > 59) return false;
    
    // Convert to 24-hour format if AM/PM is provided
    if (period) {
        if (hours < 1 || hours > 12) return false;
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
    }
    
    // Validate hours in 24-hour format
    if (hours < 0 || hours > 23) return false;
    
    // Check working hours (8:00 AM to 11:59 PM)
    return hours >= 8;
}

function isNumbervalid(phone){
    const phonePattern = /^\+2519\d{8}$/;
    return phonePattern.test(phone);
}

function isEmailValid(email){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


submitbtn.addEventListener('click', function(event) {
    // Get current values
    const verifyname = cutWhiteSpace(nameInput.value);
    const verifyemail = cutWhiteSpace(emailInput.value);
    const verifyphone = cutWhiteSpace(phoneInput.value);
    const verifiedDate = dateInput.value;
    const verifiedTime = timeInput.value;
    
    // Validate each field
    const errors = [];
    
    if (!verifyname) errors.push('Name is required');
    if (!isEmailValid(verifyemail)) errors.push('Invalid email address');
    if (!isNumbervalid(verifyphone)) errors.push('Invalid phone number (format: +2519xxxxxxxx)');
    if (!isValidDate(verifiedDate)) errors.push('Invalid date (must be mm/dd/yyyy and within next 15 days)');
    if (!isValidTime(verifiedTime)) errors.push('Invalid time (working hours: 8:00 AM - 11:59 PM)');
    
    if (errors.length > 0) {
        event.preventDefault();
        const errorElement = document.getElementById('error');
        errorElement.textContent = 'Appointment error: ' + errors.join(', ');
        errorElement.style.display = 'block';
        document.getElementById('success').style.display = 'none';
        
        // Debug output
        console.log('Validation errors:', errors);
    } else {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
    }
});
