# 🔐 VPN — Remote Application (Networking)

The **VPN** microfrontend is part of the **Networking** service group.  
It is built with [React](https://react.dev/) and [Rsbuild](https://modernjs.dev/rsbuild) using [Module Federation](https://module-federation.io/).

This module integrates into the **Chrome Host application** and provides UI and functionality for managing VPN gateways, client connections, and network configurations.

---

## 🚀 Overview

The **VPN App** provides user-facing functionality for managing VPN gateways, client connections, peer gateways, NAT mappings, and devices.  
It consumes shared components, hooks, and utilities exposed by the **Chrome Host Application**.

### 🔧 Features
- 🔐 **VPN Gateway Management** — create, view, edit, and delete VPN gateways
- 👥 **Client Connections** — manage client connections with device subnets, endpoints, and gateway IPs
- 🌐 **Peer Gateways** — configure remote gateways with routing subnets and peer endpoints
- 🔀 **NAT Mapping** — manage NAT mappings for subnets
- 📱 **Device Management** — add and manage devices for VPN connections
- 📄 **Configuration Files** — download Wireguard configuration files for Windows, macOS, and Linux
- 📱 **QR Code Generation** — generate QR codes for easy mobile device setup
- 📊 **Statistics & Monitoring** — view connection statistics including download/upload speeds and data transfer
- 🔍 **Search & Filtering** — search VPN gateways by name, public key, hostname, and NAT subnet
- 🔗 **Shared UI and logic** imported from the Host app
- 🧩 **Microfrontend integration** using Module Federation

---

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [React 18+](https://react.dev/) |
| Bundler | [Rsbuild](https://modernjs.dev/rsbuild) |
| Microfrontends | [Module Federation](https://module-federation.io/) |
| UI Library | [shadcn/ui](https://ui.shadcn.com/) *(imported from Host)* |
| Forms | [react-hook-form](https://react-hook-form.com/) *(via Host hooks)* |
| Validation | [Zod](https://zod.dev/) *(via Host hooks)* |
| Data Fetching | Redux actions *(via Host store)* |
| Global State | [Redux](https://redux.js.org/) *(via Host store)* |
| Charts | [Chart.js](https://www.chartjs.org/) |
| VPN Protocol | [Wireguard](https://www.wireguard.com/) |

---

## ⚠️ Important Note

> **This remote application cannot run independently.**  
> It must always be loaded and executed within the **Chrome Host application** context.  
> The Host provides authentication, global routing, shared UI components, and state management — all of which are required for VPN to function properly.

---

## ⚙️ Installation & Local Development

### 1. Clone the repository

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Before starting the app, you need to create a local environment file.
Copy the example file:

```bash
cp .env.example .env.local
```
Open .env.local and provide valid values for all keys (API endpoints, etc.).

### 4. Start the development server
```bash
npm run dev
```

The app will be available at:
http://localhost:8021
