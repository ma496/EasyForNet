# Send Emails Using IEmailBackgroundJobs

This document explains how to send emails using the `IEmailBackgroundJobs` service in the backend application.

## Overview

The `IEmailBackgroundJobs` service provides an asynchronous way to send emails using Hangfire for background job processing. This approach prevents email sending from blocking the main application thread.

## Configuration

Add the following configuration to your `appsettings.Development.json` file:

```json
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "SenderEmail": "your-email@gmail.com",
    "SenderName": "Sender Name"
  }
```

## Usage

### 1. Inject the Service

First, inject `IEmailBackgroundJobs` into your class:

```

### 2. Send an Email

To send an email, use the `Enqueue` method:

```

### Parameters

- `to`: The recipient's email address
- `subject`: The email subject line
- `body`: The content of the email
- `isHtml`: (Optional) Set to `true` if the body contains HTML content, defaults to `false`

## Monitor the Email Background Jobs

To monitor the email background jobs, you can use the following link:

```
http://localhost:5000/hangfire
```

