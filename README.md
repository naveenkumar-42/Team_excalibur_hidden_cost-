<h1>Identify Hidden Costs and Dark Patterns</h1>
Abstract
This project enhances transparency in online shopping by empowering consumers with tools to uncover hidden costs, identify dark patterns, and analyze deceptive design techniques. The solution, composed of a Chrome Extension and Web Application, addresses these issues through the following core features:

Hidden Cost Identifier: Exposes obscured charges during checkout.
Dark Pattern Highlighter: Flags manipulative design practices.
Dark Pattern Analyzer: Analyzes user interfaces to reveal deceptive patterns.
Price Comparison: Enables product price comparisons across platforms.
Customer Chatbot: Provides real-time support to users during their shopping journey.
By promoting fairness, autonomy, and informed decision-making, our tools contribute to a more transparent and ethical digital marketplace.

Main Features
Hidden Cost Identifier
Detects and highlights hidden charges on checkout pages, providing clarity on total costs.

Dark Pattern Highlighter
Flags deceptive tactics designed to manipulate users, helping them navigate interfaces with greater awareness.

Dark Pattern Analyzer
Analyzes websites to detect recurring patterns meant to deceive users, offering insights for better decision-making.

Price Comparison Functionality
Facilitates product price comparisons across multiple platforms, ensuring that users can make informed purchasing decisions.

Customer Chatbot
A chatbot that enhances the online shopping experience by providing real-time assistance and guidance to users.

Technology Stack
Backend: Python (BERT Model for NLP), Playwright for web scraping.
Frontend: Chrome Extension and Web Application.
Machine Learning: Custom BERT model tailored for detecting dark patterns.
Deployment: GitHub for code hosting, containerized deployment for scalability.
ML Model In-Depth
BERT Model:
Our solution utilizes a custom-built BERT (Browser Extension-based Transformer) model to detect dark patterns in web content. This model has been fine-tuned for online shopping interfaces, with specific improvements such as:

HTML tag embeddings
Domain-specific tokenization
Fine-tuned on a large corpus of labeled dark pattern data
Data Handling:
The BERT model processes labeled text data extracted from online shopping websites. Extensive preprocessing ensures accurate detection, with tokenization and encoding of data to enhance the model's performance.

Process Flow
User Interaction: Users interact with the Chrome Extension and Web Application while shopping online.
Data Collection: The system gathers data from the browsing activity, including text from websites.
Analysis: Advanced algorithms analyze the data for hidden costs and dark patterns.
Presentation: The detected costs and patterns are presented through visual cues, alerts, or explanations.
Solution Highlights
Leverages Playwright for real-time detection of hidden costs and dark patterns.
Enables informed decisions through thorough analysis and comparison across platforms.
Empowers consumers by promoting fairness and transparency in online shopping.
Deployment Architecture
Our solution is deployed as a browser extension and web application, using orchestration tools to handle multiple users and requests efficiently. Services like GitHub enable continuous deployment and scalability for real-time detection.

Impact Assessment & Conclusion
This project addresses prevalent challenges in the online shopping environment, boosting user protection and trust by exposing hidden charges, deceptive designs, and price variations. Through continuous updates, our solution remains relevant and effective against emerging threats in the online marketplace.

Team
Mugundhan K V - Fullstack Developer
Sabarish R - Backend Developer
Naveen Kumar P - Fullstack Developer
License
This project is licensed under the MIT License - see the LICENSE file for details.

Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/project-name.git
Navigate to the project directory and install dependencies.

Follow the setup instructions in the documentation for configuring the Chrome Extension and Web Application.
