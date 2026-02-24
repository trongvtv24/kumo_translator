# Plan: KumoTranslate (Chrome Extension)
Created: 24/02/2026
Status: 🟡 In Progress

## Overview
KumoTranslate là một Chrome Extension giúp dịch tự động và real-time các đoạn text (DOM nodes) từ tiếng Nhật sang Tiếng Việt/Anh. Công cụ tập trung vào việc giữ nguyên cấu trúc Layout của trang web (Smart DOM Replacement) thay vì dịch làm vỡ giao diện như các công cụ hiện tại.

## Tech Stack
- Frontend (Popup UI): HTML5, Pure CSS (Glassmorphism), Vanilla JS
- Core Logic (Content Script): Vanilla JS (MutationObserver để quét DOM real-time)
- Background Service (Service Worker): Manifest V3 background script để quản lý API và state
- API: Google Translate API (hoặc các dịch vụ dịch thuật tương đương)

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Setup Environment & Manifest V3 | ✅ Complete | 100% |
| 02 | Develop Popup UI (Settings Panel) | ✅ Complete | 100% |
| 03 | Core Translator Engine (DOM Parser) | ✅ Complete | 100% |
| 04 | Background API Handler | ✅ Complete | 100% |
| 05 | Integration & Overlay Mode | ✅ Complete | 100% |
| 06 | Testing on SPA (Google Drive, v.v) | ✅ Complete | 100% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
