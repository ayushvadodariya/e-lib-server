# E-Library Server

A Node.js/Express backend API for a digital library platform with **AI-powered content enhancement** using NLP Cloud's LLaMA 3-70B model.

## 🎯 Demo

**API Base URL**: https://e-lib-server.onrender.com

**Demo User Credentials:**
- Email: `jk.rowling@gmail.com`
- Password: `Password1!`

*This demo account has pre-uploaded books and can be used to test all API endpoints.*

## 🚀 Features

### Core Features
- User Authentication & Authorization (JWT)
- Book Management (CRUD operations for PDF books)
- File Upload & Storage (Cloudinary)
- User Profile Management

### 🤖 AI-Powered Features
- **Grammar & Spelling Correction** - Automated text correction using LLaMA 3-70B
- **Intelligent Description Enhancement** - AI-powered content improvement
- **Custom Prompts** - Support for custom instructions (e.g., "make it more exciting", "add suspense")

## 🛠️ Tech Stack

- **Runtime**: Node.js, TypeScript
- **Framework**: Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **File Storage**: Cloudinary, Multer
- **AI/NLP**: NLP Cloud API (LLaMA 3-70B)
- **Security**: CORS, Input validation

## 🤖 AI Integration

### Grammar Correction
Automatically fixes grammar and spelling mistakes using LLaMA 3-70B model.

### Description Improvement
Enhances descriptions to be more engaging with custom prompt support.

**AI Configuration:**
- Model: LLaMA 3-70B (finetuned)
- Provider: NLP Cloud
- Temperature: 0.3 (grammar), 0.7 (improvement)
- Features: GPU acceleration, custom prompts
