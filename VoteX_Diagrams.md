# CHAPTER III DIAGRAMS

You can use these diagrams for Chapter 3 of your documentation. The flowchart diagrams are written using Mermaid.js, which many markdown viewers support, but you can also use snipping tools to screenshot them and paste them into your Word document!

## 1. Development Methodologies (Agile Model)
```mermaid
flowchart LR
    A([Planning & Requirements]) --> B([System Design])
    B --> C([Development & Coding])
    C --> D([Testing])
    D --> E([Deployment])
    E --> F([Review & Feedback])
    F -.-> A
```
*Caption: Figure 1 - Agile Development Methodology*

## 2. Database Schema
```mermaid
erDiagram
    USERS {
        int user_id PK
        string student_number
        string password_hash
        boolean has_voted
    }
    CANDIDATES {
        int candidate_id PK
        string name
        string position
        string partylist
    }
    VOTES {
        int vote_id PK
        int user_id FK
        int candidate_id FK
        datetime timestamp
    }
    USERS ||--o| VOTES : "casts"
    CANDIDATES ||--o{ VOTES : "receives"
```
*Caption: Figure 2 - Database Design*

## 3. System Architecture
```mermaid
flowchart TD
    subgraph Client_Side [Client Side (Frontend)]
        A[Student Device \n Smartphone/Laptop]
        B[Admin Device \n Desktop]
    end
    
    subgraph Server_Side [Server Side (Backend)]
        C[Web API / Server \n React JS Logic & Routing]
    end
    
    subgraph Database_Layer [Database]
        D[(SQL Database)]
    end
    
    A -- "Sends login/votes" --> C
    C -- "Returns ballot/confirmation" --> A
    
    B -- "Configures system" --> C
    C -- "Returns live tally" --> B
    
    C <--> D
```
*Caption: Figure 3 - System Architecture*

## 4. (DFD) Data Flow Diagram Level 0
```mermaid
flowchart LR
    S((Student / Voter))
    A((Admin))
    VS[VoteX System]
    
    S -- "Login Credentials, Selected Votes" --> VS
    VS -- "Confirmation Message, Ballot Status" --> S
    
    A -- "Candidate Details, Election Rules" --> VS
    VS -- "Real-time Tally, Election Reports" --> A
```
*Caption: Figure 4 - DFD Level 0*

## 5. UML Use-Case Diagram
```mermaid
flowchart LR
    %% Actors
    Student([Student])
    Admin([Administrator])
    
    %% Use Cases
    subgraph VoteX System
        UC1(Login / Authenticate)
        UC2(View Candidates)
        UC3(Cast Vote)
        UC4(Manage Student Accounts)
        UC5(Manage Candidates)
        UC6(View Live Tally Dashboard)
        UC7(Generate Final Report)
    end
    
    %% Relationships
    Student --- UC1
    Student --- UC2
    Student --- UC3
    
    Admin --- UC1
    Admin --- UC4
    Admin --- UC5
    Admin --- UC6
    Admin --- UC7
```
*Caption: Figure 5 - Use-case Diagram*

## 6. Wire Frame Design

Below are conceptual AI-generated wireframes you can use as inspiration or insert directly into your document. 

### User (Voter) Page Wireframe
![VoteX User Wireframe](/C:/Users/Kyle%20Gacula/.gemini/antigravity/brain/73d53ba1-f9f7-40ac-b414-315cc8d3c382/votex_user_wireframe_1777010932610.png)
*Caption: Figure 6.1 - Mobile view of the User Voting Page.*

### Admin Dashboard Wireframe
![VoteX Admin Wireframe](/C:/Users/Kyle%20Gacula/.gemini/antigravity/brain/73d53ba1-f9f7-40ac-b414-315cc8d3c382/votex_admin_wireframe_1777011024164.png)
*Caption: Figure 6.2 - Desktop view of the Admin Tally Dashboard.*

### Additional Wireframe Descriptions
If you need to describe other pages in your Word document as requested by the template:
- **Guest/Login**: A minimalist screen featuring the John Paul College logo, a simple welcome message, two input fields (Student ID and Password), and a "Login" button.
- **Customer/Staff**: (If applicable to your project, otherwise you can merge this with Admin/User). Staff pages would look similar to the admin page but with restricted privileges (e.g., they can view the live tally but cannot delete candidates).
