document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const formData = new FormData(this);

    try {
        const response = await fetch('https://formspree.io/f/xvgpadov', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        });

        if (response.ok) {
            alert('Thank you for your feedback!');
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting feedback.');
    }
});
