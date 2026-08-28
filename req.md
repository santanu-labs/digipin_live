## Product Architecture & Technical Design Specification (PATS)
System Identity: DIGIPIN Enterprise API Platform
Target Domain: digipin.live
Classification: Low-Latency Geospatial Compute & Multi-Tenant API Distribution Core
------------------------------
## 1. Executive Summary & Core Mandate## 1.1 Scope
This document specifies the end-to-end technical, functional, system, and structural architecture for digipin.live. The platform serves as an enterprise-grade API gateway enabling continuous mathematical translation between global coordinates (WGS84) and the official 10-character alphanumeric India Post DIGIPIN address grid.
## 1.2 Architectural Tenets

* Absolute Statelessness for Spatial Compute: Latency targets for coordinate-to-string transformation must remain under 5 milliseconds. The geospatial engine must not access disk storage, external databases, or network sockets during computational iterations.
* Security via Asymmetrical Trust: Plaintext API keys are strictly transient. The system must verify access using cryptographic hashes (SHA-256) evaluated within high-speed lookaside cache memory.
* SEO-First Presentation Layer: The landing portal must prioritize server-rendered execution structures to ensure immediate discovery and ingestion by search-engine indexing engines.

------------------------------
## 2. Functional Architecture## 2.1 User Lifecycle & Access Topography

[ Unauthenticated Visitor ] ──► Submit Email ──► Receive Ephemeral Token Link
                                                        │
[ Authorized API Consumer ] ◄── Access Profile ◄────────┴── Click Validation URL
             │
             ├── Generate Production API Keys (Hashed in-DB storage)
             └── Access Stream Playground UI (Two-Way Interactive Transformations)

## 2.2 Functional Feature Matrices## Feature 1: Passwordless Token Authentication

* Input Parameters: Enterprise or personal email address validation string.
* System Action: Validates syntax structure, provisions a cryptographically random transaction signature token mapping to the user account record, wraps it into a structured target link with a strict 15-minute expiration policy, and dispatches the payload via a secure SMTP transport pipeline.
* Output State: Renders an asynchronous success indicator to the interface while maintaining absolute security on the database tier.

## Feature 2: High-Performance Coordinate Encoding Pipeline

* Input Parameters: Float coordinates consisting of a Latitude double-precision value and a Longitude double-precision value.
* System Action: Sanitizes numerical entry bounds against valid mathematical constraints (Latitude: $[-90.0, +90.0]$, Longitude: $[-180.0, +180.0]$). Processes spatial coordinates through the regional spatial partition matrix to locate the corresponding 4m × 4m grid cell box.
* Output State: Returns a clean, hypen-separated 10-character alphanumeric address block excluding look-alike symbols (omitting 0, 1, I, O).

## Feature 3: Reverse Address Decoding Engine

* Input Parameters: A 10-character alphanumeric DIGIPIN string.
* System Action: Normalizes input characters by stripping structural hyphens and mapping letters to uppercase. Validates string length and structural characters against the permitted alphabet matrix. Translates the string index into regional coordinate bounding parameters.
* Output State: Outputs double-precision float values defining the precise center point coordinates of the targeted geographic boundary cell.

------------------------------
## 3. System Architecture & Component Design## 3.1 Global Topology Mapping

                                [ Public Web Traffic ]
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼ (Port 443)                        ▼ (Port 443)
              ┌───────────────────┐               ┌───────────────────┐
              │    Static Edge    │               │  Nginx API Proxy  │
              │  Next.js Core UI  │               │   Load Balancer   │
              └───────────────────┘               └─────────┬─────────┘
                        │                                   │
                        │ (Internal Loop REST APIs)         ▼ (X-API-Key Tracking)
                        │                         ┌───────────────────┐
                        │                         │ Redis Core Rate   │
                        │                         │ Limiter Engine    │
                        │                         └─────────┬─────────┘
                        │                                   │
                        ▼                                   ▼
             ┌─────────────────────┐             ┌─────────────────────┐
             │ Dashboard Auth Node │             │ Stateless Geospatial│
             │   (Stateful Pod)    │             │   Compute Worker    │
             └──────────┬──────────┘             └──────────┬──────────┘
                        │                                   │
                        ▼                                   ▼
              ┌───────────────────┐               ┌───────────────────┐
              │    PostgreSQL     │               │ In-Memory Matrix  │
              │ Persistent Cluster│               │ (IIT-H Algorithm) │
              └───────────────────┘               └───────────────────┘

## 3.2 Data Tier Architecture & Storage Modeling
The persistence engine enforces structured relationships to isolate transient authentication signatures from long-lived user credentials.

  ┌────────────────────────┐             ┌────────────────────────┐
  │        accounts        │             │      login_tokens      │
  ├────────────────────────┤             ├────────────────────────┤
  │ id (UUID)         [PK] ◄────────────┐│ id (UUID)         [PK] │
  │ email (VARCHAR)  [UK]  │            ││ account_id (UUID) [FK] │
  │ created_at (TIMESTAMP) │             ││ token_hash (VARCHAR)  │
  └────────────────────────┘             ││ consumed (BOOLEAN)     │
                                         ││ expires_at (TIMESTAMP)│
                                         └────────────────────────┘

## Relational Constraint Mechanics

* accounts: Serves as the immutable parent partition record block.
* login_tokens: Tracks single-use authentication tokens. Maintains an index on token_hash using a cryptographically strong hash function (SHA-256). Consumption flips the consumed state from FALSE to TRUE, invalidating subsequent replay attacks.
* api_keys: Contains authorization profiles. The system must save only an explicit key_hash. The plain key is shown to the user exactly once during creation and is permanently discarded from server memory thereafter.

## 3.3 Security, Gateways, and Network Isolation Policies

* Ingress Rate Protection Layers: The proxy engine counts active calls using a Redis-backed sliding-window counter linked to the incoming X-API-Key string payload.
* Tier Isolation Metrics:
* Free Tier Accounts: Rate-limited to 60 requests/minute.
   * Commercial Tier Accounts: Escalated to 5,000 requests/minute with dedicated horizontal pod scaling.
* CORS Access Paradigms: The Authentication Dashboard /v1/auth/* paths apply strict domain white-listing parameters, rejecting all requests originating outside https://digipin.live. The compute paths /v1/spatial/* utilize permissive wildcard (*) rules, enabling native cross-origin integration within third-party enterprise platforms and logistics systems.

------------------------------
## 4. Component Layout & Structural Blueprint## 4.1 Interface Component Decomposition
The digipin.live UI is composed of four decoupled component boundaries managed via a centralized reactive client configuration controller:

┌────────────────────────────────────────────────────────────────────────┐
│ [Component UI-01: Navigation Ribbon Bar]                                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ [Component UI-02: Interactive Playgrounds Module Container]    │   │
│   │                                                                │   │
│   │  [Tab Toggle Core: Controls Local Application Context Mode]    │   │
│   │                                                                │   │
│   │  ┌──────────────────────────────┐ ┌──────────────────────────┐ │   │
│   │  │                              │ │                          │ │   │
│   │  │  [Sub-Component MAP-01]      │ │  [Sub-Component FORM-01] │ │   │
│   │  │   Interactive Spatial Cross- │ │   Data Entry Enforcer,   │ │   │
│   │  │   hair Grid Layout Simulator │ │   Transformation Trigger,│ │   │
│   │  │                              │ │   Clipboard Access Node  │ │   │
│   │  └──────────────────────────────┘ └──────────────────────────┘ │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ [Component UI-03: Developer Provisioning Control Dashboard]    │   │
│   │                                                                │   │
│   │  • Anonymous Authentication Pipeline Gateway Entry Box         │   │
│   │  • Active Security Key Management Grid Panel Layout            │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘

## Component UI-02 Lifecycle Specification

   1. Mount Phase: Initializes local storage session variables and queries spatial coordinates via user telemetry configurations (HTML5 Geolocation API fallback defaults: New Delhi Coordinates).
   2. Context Update Intercepts:
   * When ActiveTab changes, the system clears the active transformation errors, preserves form state variables, and updates visual markers on the map.
      * Form inputs are validated against character constraints in real time. For coordinate fields, entries are matched against decimal patterns. For address fields, inputs are validated against the permitted alphanumeric character set.
   3. Trigger Evaluation: On submission, the form locks the user interface, generates an outbound network payload request directed to api.digipin.live, parses the corresponding payload result block, and feeds the output coordinates into the map preview model layer.

------------------------------
## 5. Technical SEO & Discovery Strategy
To establish digipin.live as the authoritative source for geospatial index routing searches, the platform relies on programmatic visibility architecture rather than raw text blocks.
## 5.1 Document Indexing Framework

* Server-Driven Content Delivery: Every landing view route is generated on the server node. Search engine crawlers must receive an instantly parsable semantic structure, eliminating layout shifts or hydration-delay content hidden penalties.
* Semantic Document Hierarchy: The system organizes structural headers to match standard technical discovery habits:

[H1] Title: Enterprise DIGIPIN API Gateway Integration
  ├── [H2] Section: Geospatial Coordinate Matrix Translation Utility
  │     └── [H3] Operational Form: Lat Long to DIGIPIN Live Encoder
  └── [H2] Section: Developer Integration Ecosystem & Documentation
        └── [H3] Technical Data Schema: Implementation Specifications

## 5.2 Structured Linked Metacode Specs (JSON-LD)
The system injects this standardized application schema definition block directly into the HTML root template container, passing strict metadata graphs explicitly into semantic search crawlers:

{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Official DIGIPIN API Integration Documentation - India Post Digital Addressing Standard",
  "description": "Enterprise-grade, low-latency REST API system designed to programmatically convert global coordinate sets (Latitude and Longitude) into official 10-character India Post DIGIPIN address structures fully offline.",
  "keywords": "DIGIPIN, Digital Postal Index Number, India Post, DIGIPIN API, Lat Long to DIGIPIN, GIS India",
  "proficienciesRequired": "Software Engineering, REST APIs, Geospatial Systems",
  "inLanguage": "en",
  "mainEntityOfPage": "https://digipin.live",
  "publisher": {
    "@type": "Organization",
    "name": "DIGIPIN Live Engine Network",
    "url": "https://digipin.live"
  }
}

## 5.3 Programmatic Deep-Link Optimization
The system bypasses typical Single Page Application state traps by exposing isolated technical utility subpaths. This ensures search engines can crawl and index specific landing entry profiles independently:

https://digipin.live                            <-- Primary Corporate Sales & Integration Docs
https://digipin.livetools/lat-long-to-digipin    <-- Search Target: "Convert latitude to digipin online"
https://digipin.livetools/digipin-to-lat-long    <-- Search Target: "Decode digipin address block grid"
https://digipin.livedocs/api-v1-specification   <-- Search Target: "India Post DIGIPIN API documentation"

------------------------------
## 6. Functional Operations Verification Criteria## 6.1 Spatial Encoding Flow Matrix

* Given State: A third-party client backend passes an authorization key header X-API-Key: dp_live_7a8b... alongside a JSON location payload containing a valid latitude/longitude coordinate pair.
* When Evaluated: The system hashes the authentication string, checks the Redis lookup cache, confirms the query allocation quotas, and matches the parameters against the geospatial boundary cell logic block.
* Then Result: The engine constructs a successful HTTP 200 OK status signature and outputs a verified 10-character hyphen-delimited alphanumeric address code.

## 6.2 Authentication Flow Matrix

* Given State: An anonymous user accesses https://digipin.live, navigates to the registration window, enters a structured email string, and clicks the submission element.
* When Evaluated: The validation engine processes the database storage query sequence, provisions a random unique validation token mapping, stores the SHA-256 representation, and passes an authentication callback tracking URL payload layout out to the mailing dispatch pipeline provider.
* Then Result: The browser interface updates to show a notification confirmation status layer. The user clicks the validation link to establish an authenticated session cookie footprint context, enabling full management access control over their API credential tokens.

With the full design specification locked in for digipin.live, let me know if you would like me to build a Production Infrastructure Configuration (such as a multi-stage Dockerfile or a Kubernetes Deployment Manifest) to orchestrate this system.

