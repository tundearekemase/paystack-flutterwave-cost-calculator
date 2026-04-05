# Software Requirements Specification (SRS) Gbam (PricePal) – WhatsApp-Based Price Intelligence & Marketplace

# 1\. Introduction

Gbam (PricePa)RSl is a WhatsApp-based platform that provides real-time market price intelligence and enables users to purchase commodities directly via chat. This document defines the functional and non-functional requirements for the MVP.

# 2\. Overall Description

The system enables users to check prices, compare sellers, add items to a cart, and complete purchases via WhatsApp. It targets low-tech users in African markets.

# 3\. System Features

## 3.1 User Onboarding

User initiates chat with 'Hi'. System responds with welcome message and options: Check Prices, Buy, Sell, Help.

## 3.2 Price Intelligence

Users can query product prices. System returns average, lowest, highest prices and number of reports.

## 3.3 Seller Discovery

Users can view sellers based on proximity and price.

## 3.4 Cart Management

Users can add multiple items to a cart, view cart, update quantities, and proceed to checkout.

## 3.5 Order & Payment

Users confirm order, choose delivery or pickup, and pay via bank transfer. System tracks order status.

## 3.6 Price Reporting

Users submit price data which updates system intelligence.

## 3.7 Seller Onboarding

Sellers can list products with price and location.

# 4\. Detailed User Flow

## 4.1 Entry Point

User: Hi  
System: Welcome message \+ options

## 4.2 Price Inquiry Flow

User asks: 'What’s the price of rice?'  
System returns price summary and options to buy or view sellers.

## 4.3 Add to Cart Flow

User selects seller → adds item to cart → continues shopping or checkout.

## 4.4 Checkout Flow

User reviews cart → selects delivery/pickup → confirms total cost.

## 4.5 Payment Flow

System provides bank details → user pays → confirms payment → system verifies.

## 4.6 Fulfillment

Order is processed → delivery or pickup arranged → user confirms receipt.

# 5\. Non-Functional Requirements

Performance: fast responses  
Scalability: support thousands of users  
Security: protect user data  
Reliability: system uptime

# 

# 

# Gbam (PricePal) \- WhatsApp-Based Price Intelligence & Marketplace 

# Software Requirements Specification (SRS) – Version 2 (Advanced Build)

# 1\. Executive Summary

PricePal is a WhatsApp-native price intelligence and marketplace platform designed for African markets. It enables users to discover real-time prices, compare sellers, manage carts, and complete transactions within chat.

# 2\. End-to-End Conversation Flow (Decision Tree)

ENTRY: User sends "Hi"  
→ System: Welcome \+ options

IF user selects "Check Prices"  
→ Ask product  
→ Show price summary  
→ Options: Buy | Sellers | Report

IF user selects "Buy"  
→ Show sellers  
→ Select seller  
→ Add to cart or Buy now

IF Add to Cart  
→ Store item  
→ Ask: Continue shopping or Checkout

IF Checkout  
→ Show cart summary  
→ Choose delivery/pickup  
→ Payment  
→ Confirmation

IF Report Price  
→ Collect price \+ location \+ optional proof  
→ Store data

# 3\. Cart System Design

\- Users can add multiple items  
\- Each item includes product, seller, price, quantity  
\- Cart persists per user session  
\- Actions:  
  \- Add item  
  \- Remove item  
  \- Update quantity  
  \- View cart  
  \- Checkout  
\- Cart stored in database (linked to user phone number)

# 4\. Backend Architecture

Components:  
\- WhatsApp API (Meta Cloud API)  
\- Backend (Node.js server)  
\- Firebase Firestore (database)  
\- Admin Dashboard (web interface)

Flow:  
User → WhatsApp → Webhook → Backend → Database → Response → User

# 5\. Data Models

Users: id, phone, location  
Products: id, name, category  
Prices: product\_id, value, location, timestamp  
Sellers: id, name, product, price, location  
Cart: user\_id, items\[\]  
Orders: id, user\_id, items, total, status

# 6\. Fraud & Trust System

\- Seller verification (manual)  
\- Rating system  
\- Flag suspicious prices  
\- Require proof for price submissions  
\- Escrow payment system (future)

# 7\. Scalability Roadmap

MVP:  
\- Manual operations  
\- Single city  
\- Limited products

Growth (10k users):  
\- Automation  
\- API integration  
\- Multiple cities

Scale (1M users):  
\- Full infrastructure  
\- AI optimization  
\- Data monetization

# 8\. Non-Functional Requirements

\- Performance: \<2s response time  
\- Availability: 99% uptime  
\- Security: encrypted data  
\- Usability: simple WhatsApp interface