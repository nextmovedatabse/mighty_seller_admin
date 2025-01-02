const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsvZtQSa5hjpgXwD9F9kWQ-4evFlVxxgMQypj_5ZL9Vqe2DPKomToWJB9mXYiLHfI8iA/exec';

document.addEventListener('DOMContentLoaded', fetchData);

function confirmRemove() {
    const titleToRemove = document.getElementById('titleToRemove').value.trim();
    const messageDiv = document.getElementById('removeMessage');
    
    if (!titleToRemove) {
        messageDiv.innerHTML = '<div class="error">Please enter a title</div>';
        return;
    }

    document.getElementById('confirmTitle').textContent = titleToRemove;
    document.getElementById('confirmModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

async function removeData() {
    const titleToRemove = document.getElementById('titleToRemove').value.trim();
    const messageDiv = document.getElementById('removeMessage');
    
    try {
        const response = await fetch(`${SCRIPT_URL}?action=remove&title=${encodeURIComponent(titleToRemove)}`, {
            method: 'GET'
        });
        
        const result = await response.json();
        closeModal();
        
        if (result.status === 'success') {
            messageDiv.innerHTML = '<div class="success">Data removed successfully!</div>';
            document.getElementById('titleToRemove').value = '';
            fetchData();
        } else {
            messageDiv.innerHTML = `<div class="error">${result.message}</div>`;
        }
    } catch (error) {
        closeModal();
        messageDiv.innerHTML = '<div class="error">Error removing data. Please try again.</div>';
        console.error('Error:', error);
    }
}

async function fetchData() {
    const tableDiv = document.getElementById('dataTable');
    
    try {
        const response = await fetch(`${SCRIPT_URL}?action=fetch`);
        const data = await response.json();
        
        if (data.status === 'success') {
            let html = '<table>';
            
            html += '<tr>';
            for (const header of data.headers) {
                html += `<th>${header}</th>`;
            }
            html += '</tr>';
            
            for (const row of data.data) {
                html += '<tr>';
                for (const cell of row) {
                    html += `<td>${cell}</td>`;
                }
                html += '</tr>';
            }
            
            html += '</table>';
            tableDiv.innerHTML = html;
        } else {
            tableDiv.innerHTML = `<div class="error">${data.message}</div>`;
        }
    } catch (error) {
        tableDiv.innerHTML = '<div class="error">Error fetching data. Please try again.</div>';
        console.error('Error:', error);
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        closeModal();
    }
}
