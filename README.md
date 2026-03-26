# 🔧 คู่มือระบบแจ้งซ่อมบำรุงในสถานศึกษา (Maintenance Management System)
## โครงการ SDDI - Version 2025 (Master Edition)

ระบบบริหารจัดการงานซ่อมบำรุงสำหรับสถานศึกษาแบบครบวงจร ครอบคลุมตั้งแต่การแจ้งซ่อม, การติดตามสถานะ, การจัดการวัสดุอุปกรณ์, ไปจนถึงการออกรายงานสถิติ เพื่อประสิทธิภาพสูงสุดในการดูแลรักษาสิ่งอำนวยความสะดวก

## สรุปการปรับปรุงแก้ไข (Revision History)

| เวอร์ชัน | วันที่       | รายละเอียดการปรับปรุง                                                                
|----------|--------------|-----------------------------------------------------------------------------------------|
| 1.0      | 10 ธ.ค. 68   | ฉบับร่างแรก (Initial Draft)                                                           |
| 2.0      | 17 ธ.ค. 68   | 1. ปรับโครงสร้างเอกสาร: จัดหมวดหมู่ตามมาตรฐาน IEEE 830 เพื่อความเป็นสากล<br>2. เพิ่มรหัสอ้างอิง (Requirement ID): ใส่รหัส REQ-xxx เพื่อให้ง่ายต่อการอ้างอิง<br>3. เพิ่มรายละเอียด Functional: ผนวกรายละเอียดฟิลด์ข้อมูลและเกณฑ์ SLA จากต้นฉบับ<br>4. เพิ่มรายละเอียด Non-Functional: ระบุค่าชี้วัดที่ชัดเจน<br>5. ระบุรายชื่อทีมงาน: เพิ่มส่วนคณะผู้จัดทำ |

## 1. บทนำ (Introduction)

### 1.1 วัตถุประสงค์ (Purpose)
เอกสารนี้จัดทำขึ้นเพื่อระบุข้อกำหนดความต้องการของระบบแจ้งซ่อมอย่างละเอียด เพื่อใช้เป็นแนวทางในการพัฒนาซอฟต์แวร์ ทดสอบระบบ และส่งมอบงาน โดยมุ่งเน้นการแก้ปัญหาความล่าช้าในการแจ้งซ่อม การติดตามสถานะที่ยากลำบาก และการขาดข้อมูลเพื่อการวิเคราะห์และวางแผนบำรุงรักษา

### 1.2 ขอบเขตของซอฟต์แวร์ (Scope)
ระบบแจ้งซ่อม เป็นเว็บแอปพลิเคชัน (Web Application) ที่ครอบคลุมกระบวนการตั้งแต่การแจ้งปัญหา ติดตามสถานะ การมอบหมายงานช่าง การบริหารจัดการวัสดุอุปกรณ์ จนถึงการออกรายงานสรุปผล เพื่อเพิ่มประสิทธิภาพในการบริหารจัดการ

### 1.3 คำจำกัดความและคำย่อ (Definitions and Acronyms)
- **User/Requester:** ผู้ใช้งานทั่วไป ที่เป็นผู้แจ้งซ่อม  
- **Admin:** ผู้ดูแลระบบที่มีสิทธิ์จัดการข้อมูลพื้นฐานและสิทธิ์ผู้ใช้งาน  
- **Technician:** ช่างซ่อมบำรุง  
- **Manager:** หัวหน้างานหรือผู้บริหารที่ดูภาพรวมและรายงาน  
- **SLA (Service Level Agreement):** ข้อตกลงระดับการให้บริการ  

---

## 2. รายละเอียดโดยรวม (Overall Description)

### 2.1 มุมมองผลิตภัณฑ์ (Product Perspective)
ระบบนี้ทำงานเป็นเอกเทศ (Standalone) (ถ้ามี) และรองรับการใช้งานผ่าน Web Browser ทั้งบน Desktop และ Mobile (Responsive Design)

### 2.2 คุณลักษณะของผู้ใช้งาน (User Characteristics)
- **ผู้แจ้งซ่อม (General User):** มีทักษะคอมพิวเตอร์พื้นฐาน ต้องการความสะดวกรวดเร็วในการแจ้ง  
- **ช่างซ่อม (Technician):** เน้นการใช้งานผ่านมือถือหน้างาน ต้องการเห็นข้อมูลงานที่ได้รับมอบหมายชัดเจน  
- **หัวหน้าช่าง/เจ้าหน้าที่ (Staff/Manager):** มีความเข้าใจกระบวนการซ่อมบำรุง ต้องการเครื่องมือในการมอบหมายและติดตามงาน  
- **ผู้ดูแลระบบ (Admin):** มีความรู้ด้านเทคนิค เพื่อแก้ไขปัญหาและจัดการสิทธิ์  

### 2.3 ข้อสมมติฐานและข้อจำกัด (Assumptions and Dependencies)
- ผู้ใช้งานทุกคนต้องมีบัญชีอินเทอร์เน็ตของสถานศึกษา  
- การแจ้งเตือนผ่าน Email อาศัย SMTP Server ของสถานศึกษา  
- รูปภาพที่อัพโหลดต้องมีขนาดไม่เกิน 10MB ต่อรูป  

---

## 3. ความต้องการด้านฟังก์ชัน (Functional Requirements)

### 3.1 โมดูลการแจ้งซ่อม (Repair Request Module)
- **REQ-01:** ระบบต้องสามารถบันทึกข้อมูลการแจ้งซ่อม โดยดึงข้อมูลผู้แจ้งอัตโนมัติ (ชื่อ-สกุล, รหัสประจำตัว, ตำแหน่ง) จากการ Login  
- **REQ-02:** ผู้ใช้ต้องสามารถเลือกประเภทปัญหาได้ โดยระบบมีตัวเลือกดังนี้: ไฟฟ้า, ประปา, โครงสร้าง, อุปกรณ์อิเล็กทรอนิกส์, เครื่องปรับอากาศ  
- **REQ-03:** ผู้ใช้ต้องระบุตำแหน่งที่เกิดเหตุ (อาคาร, ชั้น, ห้อง) ผ่าน Dropdown list เพื่อความถูกต้อง  
- **REQ-04:** ระบบต้องรองรับการอัปโหลดรูปภาพประกอบความเสียหาย (รองรับไฟล์ .JPG, .PNG)  
- **REQ-05:** ระบบต้องกำหนดระดับความเร่งด่วน (SLA) ให้เลือก ดังนี้:  
    - ฉุกเฉิน: ต้องดำเนินการทันที  
    - เร่งด่วน: ภายใน 24 ชั่วโมง  
    - ปกติ: ภายใน 3 วันทำการ  
    - ไม่เร่งด่วน: ภายใน 7 วันทำการ  
- **REQ-06:** เมื่อแจ้งซ่อมสำเร็จ ระบบต้องแสดงหมายเลขติดตามงาน (Tracking ID) และส่งอีเมลยืนยัน  

### 3.2 โมดูลการจัดการงานซ่อม (Job Management Module)
- **REQ-07:** หัวหน้าช่างสามารถกรองรายการแจ้งซ่อมตามความเร่งด่วนและประเภทงาน เพื่อจัดลำดับความสำคัญ  
- **REQ-08:** ระบบต้องแสดงตารางงานปัจจุบันของช่าง เพื่อช่วยในการมอบหมายงาน (Assign) ป้องกันงานซ้อนทับ  
- **REQ-09:** ระบบสามารถแจ้งเตือนช่างผ่านแอปพลิเคชัน/อีเมล เมื่อได้รับมอบหมายงานใหม่  
- **REQ-10:** ช่างซ่อมสามารถบันทึกข้อมูลการดำเนินการผ่านมือถือได้ (เวลาเริ่ม-สิ้นสุด, รายละเอียดการซ่อม, รูปภาพหลังซ่อม)  
- **REQ-11:** สถานะของงานซ่อมต้องประกอบด้วย: รอดำเนินการ, กำลังดำเนินการ, รอตรวจสอบ, เสร็จสมบูรณ์, ต้องส่งซ่อมภายนอก  

### 3.3 โมดูลบริหารจัดการวัสดุ (Inventory Module)
- **REQ-12:** ระบบต้องเก็บข้อมูลวัสดุ (รหัส, ชื่อ, ประเภท, ยี่ห้อ, จำนวนคงเหลือ, ราคาต่อหน่วย, จุดสั่งซื้อ)  
- **REQ-13:** ช่างซ่อมสามารถบันทึกการเบิกใช้วัสดุในแต่ละใบงานซ่อมได้ และระบบจะตัดสต็อกอัตโนมัติ  
- **REQ-14:** ระบบต้องแจ้งเตือน (Low Stock Alert) เมื่อวัสดุลดลงถึงจุด Reorder Point หรือเมื่อวัสดุหมดอายุ  
- **REQ-15:** รองรับการบันทึกการรับเข้าวัสดุใหม่และการตรวจนับสต็อก (Stock Taking)  

### 3.4 โมดูลรายงานและผู้บริหาร (Dashboard & Reporting)
- **REQ-16:** ระบบแสดง Dashboard ภาพรวมสำหรับผู้บริหาร:  
    - กราฟแนวโน้มการแจ้งซ่อมรายเดือน  
    - สัดส่วนประเภทงานซ่อม  
    - พื้นที่ที่มีการแจ้งซ่อมบ่อย  
- **REQ-17:** ระบบสามารถออกรายงานประสิทธิภาพช่าง (ระยะเวลาเฉลี่ยในการปิดงาน, คะแนนความพึงพอใจ)  
- **REQ-18:** ระบบสามารถออกรายงานสรุปการใช้วัสดุและค่าใช้จ่ายในการซ่อมบำรุง  

### 3.5 โมดูลประเมินผล (Evaluation Module)
- **REQ-19:** เมื่อสถานะงานเป็น "เสร็จสมบูรณ์" ระบบต้องเปิดให้ผู้แจ้งซ่อมทำแบบประเมินความพึงพอใจ (คุณภาพ, ความรวดเร็ว, การบริการ)  

---

## 4. ความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)

### 4.1 ประสิทธิภาพ (Performance)
- รองรับผู้ใช้งานพร้อมกัน (Concurrent Users) ได้ไม่น้อยกว่า 200 คน  
- เวลาตอบสนอง (Response Time) ไม่เกิน 3 วินาที สำหรับการใช้งานทั่วไป  
- ระบบต้องทำงานได้ตลอด 24 ชั่วโมง (Uptime 99.5%)  

### 4.2 ความปลอดภัย (Security)
- รหัสผ่านต้องถูกเข้ารหัส (Encryption) ด้วยมาตรฐาน SHA-256 หรือดีกว่า  
- มีการแบ่งสิทธิ์การเข้าถึงข้อมูล (RBAC) ชัดเจนระหว่าง User, Technician, Admin  
- บันทึก Log การใช้งานและการแก้ไขข้อมูลสำคัญ (Audit Trail)  
- สำรองข้อมูล (Backup) อัตโนมัติทุกวัน  

### 4.3 การใช้งาน (Usability)
- User Interface เป็นภาษาไทย ใช้งานง่าย  
- รองรับ Responsive Design แสดงผลได้ดีบนทั้ง Desktop, Tablet และ Smartphone  

---

## 5. ข้อมูลทางด้านเทคนิค (Technical Overview)

### 5.1 System Architecture 🏗️
ระบบถูกพัฒนาด้วยสถาปัตยกรรม **Serverless** บน Google Cloud Platform (Firebase) เพื่อความรวดเร็วในการขยายตัวและความปลอดภัยสูง

```mermaid
graph TD
    Client[Browser / Mobile Web] -- HTTPS/REST --> API[Firebase Cloud Functions / Express]
    API -- Auth --> Auth[JWT / bcrypt]
    API -- Read/Write --> Firestore[(Google Cloud Firestore)]
    API -- Upload --> Storage[Firebase Storage]
    API -- Email --> Resend[Resend API]
    API -- SMS --> Twilio[Twilio SMS]
    Hosting[Firebase Hosting] -- Serves --> Client
```

### 5.2 Use Case Diagram 👤
ระบบรองรับ 4 บทบาทหลักที่มีสิทธิ์การใช้งานแตกต่างกัน

```mermaid
useCaseDiagram
    actor "User" as U
    actor "Technician" as T
    actor "Manager" as M
    actor "Admin" as A

    package "ระบบแจ้งซ่อม" {
        usecase "แจ้งซ่อมใหม่ (Submit Request)" as UC1
        usecase "ติดตามสถานะ (Track Status)" as UC2
        usecase "ประเมินความพึงพอใจ (Evaluate)" as UC3
        usecase "อัปเดตงานซ่อม (Fix & Update)" as UC4
        usecase "เบิกวัสดุอุปกรณ์ (Withdraw Materials)" as UC5
        usecase "มอบหมายงาน (Assign Task)" as UC6
        usecase "จัดการใบจัดซื้อ (PO Management)" as UC7
        usecase "ดูรายงานสรุป (Dashboard & Reports)" as UC8
        usecase "จัดการผู้ใช้และสิทธิ์ (User Mgmt)" as UC9
    }

    U --> UC1
    U --> UC2
    U --> UC3
    
    T --> UC4
    T --> UC5
    T --> UC2
    
    M --> UC6
    M --> UC7
    M --> UC8
    
    A --> UC9
    A --> UC8
    A --> UC6
```

### 5.3 Activity Diagram (Repair Workflow) ⚙️
กระบวนการทำงานตั้งแต่เริ่มจนจบงานซ่อม

```mermaid
activityDiagram
    start
    :User: แจ้งซ่อมผ่านระบบ;
    :System: ส่ง Notification หา Manager;
    if (เปิด Auto-Assign?) then (ใช่)
        :System: มอบหมายช่างที่มีงานน้อยที่สุดอัตโนมัติ;
    else (ไม่)
        :Manager: มอบหมายงานให้ช่างด้วยตนเอง;
    endif
    :Technician: รับงานและเริ่มดำเนินการ;
    :Technician: เบิกวัสดุจากคลัง (ถ้ามี);
    :Technician: อัปเดตรูปถ่าย (ก่อน/หลัง) และสถานะ;
    :System: แจ้งเตือน User เมื่อเสร็จสิ้น;
    :User: ประเมินความพึงพอใจ;
    stop
```

### 5.4 ER Diagram (Database Schema) 📊
โครงสร้างข้อมูลบน **NoSQL Firestore**

```mermaid
erDiagram
    USERS {
        string id PK
        string email
        string password
        string role
        string department
    }
    REPAIR_REQUESTS {
        string id PK
        string tracking_id
        string status
        string category
        string urgency
        timestamp created_at
    }
    MATERIALS {
        string id PK
        string name
        int quantity
        float unit_price
        date expiry_date
    }
    PURCHASE_ORDERS {
        string id PK
        string code
        string status
        float total_amount
    }
    EVALUATIONS {
        string id PK
        string request_id FK
        int score
        string comment
    }

    USERS ||--o{ REPAIR_REQUESTS : "notifies"
    REPAIR_REQUESTS ||--o{ MATERIALS : "uses"
    REPAIR_REQUESTS ||--o| EVALUATIONS : "has"
    USERS ||--o{ PURCHASE_ORDERS : "manages"
```

---

## 6. ประสบการณ์ผู้ใช้ (UX/UI) & การออกแบบ

### 6.1 User Flow
1. **Login:** เลือก Dashboard ตามบทบาท
2. **Action:** แจ้งซ่อม (User) / ทำงาน (Tech) / อนุมัติ (Manager)
3. **Finish:** ปิดงานพร้อมหลักฐานรูปภาพและตัดสต็อกวัสดุอัตโนมัติ

### 6.2 UX/UI Principles
- **Dark Mode Aesthetic:** ใช้โทนสีมืด (Deep Blue & Graphite) เพื่อลดความเมื่อยล้าทางสายตาและดูพรีเมียม
- **Glassmorphism:** ใช้เอฟเฟกต์ความโปร่งใสและ Blur ใน Cards และ Modals
- **Micro-Animations:** มี Feedback เมื่อกดปุ่มหรือเปลี่ยนสถานะ
- **Responsive Web Design:** รองรับ Mobile Web สำหรับช่างที่ต้องทำงานหน้างาน

### 6.3 API Endpoints (Core)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | เข้าสู่ระบบ | No |
| POST | `/api/requests` | แจ้งซ่อมใหม่ | User |
| PATCH | `/api/requests/:id/assign` | มอบหมายช่าง | Manager |
| PATCH | `/api/requests/:id/status` | อัปเดตสถานะงาน | Tech |
| GET | `/api/reports/summary` | สรุปข้อมูลสถิติ | Manager |

---

## 6. Stack & Tools ✨

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript ES6+
- **Backend:** Node.js, Express.js
- **Compute:** Firebase Cloud Functions (v2)
- **Database:** Google Firestore (Serverless NoSQL)
- **Files:** Firebase Storage (Media Evidence)
- **Communication:** Resend (Email), Twilio (SMS Notification)
- **Security:** bcrypt (Password Hashing), JWT (Stateless Auth)
- **Testing:** Newman (Postman CLI), manual test cases

---

## 7. การทดสอบและรายงาน (Testing) 🧪

### 7.1 Test Cases (Sample)
| ID | Title | Expected Result | Status |
|---|---|---|---|
| TC-01 | สร้างใบแจ้งซ่อม | ระบบต้องออก Tracking ID และส่งเมล์หาผู้แจ้ง | ✅ Pass |
| TC-02 | เบิกวัสดุเกินสต็อก | ระบบต้องแจ้งเตือนและไม่อนุญาตให้เบิก | ✅ Pass |
| TC-03 | มอบหมายงานอัตโนมัติ | ระบบต้องเลือกช่างที่งานน้อยที่สุดในตอนนั้น | ✅ Pass |
| TC-04 | แจ้งเตือนฉุกเฉิน | ระบบต้องส่ง SMS หา Manager ทันที | ✅ Pass |

### 7.2 API Testing
เราใช้ **Postman** ในการรัน Integration Test สำหรับ API ทั้งหมด 25+ Endpoints เพื่อให้มั่นใจว่าระบบทำงานประสานกันได้ไร้รอยต่อ

---
> [!NOTE]
> ระบบนี้ถูกออกแบบมาเพื่อรองรับผู้ใช้พร้อมกันสูงสุด 200 คน (Concurrent) โดยมีการทำ Rate Limiting เพื่อป้องกันการยิง API เกินความจำเป็น

ระบบบริหารจัดการงานซ่อมบำรุงสำหรับสถานศึกษาที่ออกแบบมาเป็น **Serverless Multi-Role SPA** ที่มีความทันสมัย กระชับ และมีประสิทธิภาพสูงสุด เน้นการใช้งานที่ง่าย (Simple) และภาระการบำรุงรักษาต่ำ (Low Maintenance) 

---

## 📂 8. โครงสร้างโครงการ (Project Structure)

โครงการนี้ใช้สถาปัตยกรรม **Monorepo-style** แบ่งส่วนการทำงานออกจากกันอย่างชัดเจน:

- **`/public`**: ส่วนหน้าบ้าน (Frontend) ทั้งหมด
    - `admin.html`, `manager.html`, `technician.html`, `user.html`: หน้า GUI แยกตามบทบาท
    - `index.html`: หน้าล็อกอินหลักและจุดเริ่มต้นของระบบ
    - `style.css`: ไฟล์สไตล์กลาง (Glassmorphism & Neon Design)
    - **`/js`**: ไฟล์ตรรกะเบื้องหลัง (Business Logic)
        - `code.js`: **Core Engine** (จัดการ Navigation, Auth Refresh, UI Helpers)
        - `auth.js`: ระบบยืนยันตัวตนและการเข้าถึง
        - `Requests.js`, `Materials.js`, `Users.js`: ฟังก์ชันจัดการโมดูลต่าง ๆ
        - `Settings.js`: ระบบรวมการจัดการ SMTP, บันทึก Log และสิทธิ์ในหน้าเดียว
- **`/backend`**: ส่วนหลังบ้าน (Node.js API)
    - `index.js`: จุดเชื่อมต่อหลัก (Express + Firebase Functions)
    - **`/routes`**: การกำหนดเส้นทาง API แยกตามบริการ (RESTful Endpoints)
    - **`/services`**: บริการเสริมอิสระ เช่น `NotificationService` (SMTP Email)
    - **`/db`**: การตั้งค่าและการ Seed ข้อมูลเบื้องต้นลง Firestore
- **`/firestore.rules`**: กฎความปลอดภัยสำหรับการเข้าถึงฐานข้อมูลในระดับโปรดักชัน

---

## 🏗️ 9. สถาปัตยกรรมระบบ (System Architecture)

### 9.1 ภาพรวมการทำงาน (System Overview)
ระบบทำงานในรูปแบบ **Cloud-First** โดย Frontend สื่อสารกับ Backend ผ่าน **REST API** และใช้ JWT (JSON Web Token) ในการยืนยันตัวตน

```mermaid
graph TD
    User((👩‍💻 ผู้ใช้/ช่าง/แอดมิน)) -- Access --> Web[Frontend]
    Web -- HTTPS/JWT --> API[Express.js on Cloud Functions]
    API -- Admin SDK --> DB[(Google Firestore)]
    API -- Admin SDK --> Storage[Firebase Storage]
    API -- SMTP --> Mail[Mail Server / SMTP]
    
    subgraph "ความปลอดภัย (Security)"
        Auth[JWT Authentication]
        Rate[Rate Limiting]
        Rules[Firestore Rules: Deny All]
        Helm[Helmet Security Headers]
    end
```

### 9.2 วงจรชีวิตของใบแจ้งซ่อม (Repair Request Lifecycle)
ทุกใบแจ้งซ่อมจะมี Tracking ID หกหลัก (เช่น `REQ782`) และมีสถานะดังนี้:

1.  **รอดำเนินการ (Pending):** เมื่อผู้ใช้ (User) ส่งใบแจ้งซ่อมใหม่ (ระบบส่งเมลหา Manager)
2.  **กำลังดำเนินการ (Ongoing):** เมื่อมีการมอบหมายช่าง หรือช่างกดรับงาน (ช่างอัปเดตรูป "ก่อนทำ")
3.  **รอตรวจสอบ (Review):** เมื่อช่างซ่อมเสร็จและเบิกวัสดุเรียบร้อย (ช่างอัปเดตรูป "หลังทำ")
4.  **เสร็จสมบูรณ์ (Completed):** เมื่อหัวหน้าหรือผู้ใช้ยืนยันการรับงาน (ระบบส่งเมลหา User ให้ประเมิน)

---

## 📊 10. ฐานข้อมูลและสิทธิ์ (Database & RBAC)

### 10.1 โครงสร้างฐานข้อมูล (Firestore Collections)
| Collection | รายละเอียด | ฟิลด์ข้อมูลสำคัญ |
|---|---|---|
| `users` | บัญชีผู้ใช้งาน | `id, name, email, role, department, password (hashed)` |
| `repair_requests` | รายการซ่อม | `tracking_id, title, status, location, urgency, media_paths` |
| `materials` | คลังวัสดุ | `name, quantity, unit, unit_price, reorder_point` |
| `audit_logs` | ประวัติกิจกรรม | `user_id, action, target_id, detail, created_at` |
| `notifications` | การแจ้งเตือนในแอป | `user_id, title, message, is_read` |
| `settings` | การตั้งค่าระบบ | `smtp_host, smtp_port, auto_assign_enabled` |

### 10.2 ตารางสิทธิ์เข้าถึง (RBAC Matrix)
| ฟังก์ชัน | User | Tech | Manager | Admin |
|---|:---:|:---:|:---:|:---:|
| แจ้งซ่อมใหม่ (New Request) | ✅ | – | ✅ | ✅ |
| ติดตามสถานะ (Track Status) | ✅ | ✅ | ✅ | ✅ |
| รับงาน/ซ่อมงาน (Work) | – | ✅ | – | – |
| บริหารจัดการคลัง (Inventory) | – | ✅* | ✅ | ✅ |
| มอบหมายงาน (Assign) | – | – | ✅ | ✅ |
| จัดการผู้ใช้ & ระบบ (Settings) | – | – | ✅ | ✅ |
| ล้างข้อมูลระบบ (Factory Reset) | – | – | – | ✅ |
*\*ช่างทำได้เฉพาะเบิกวัสดุ ไม่สามารถแก้ราคาหรือลบรายการได้*

---

## 🔗 11. เส้นทาง API (API Endpoints Overview)

| Method | Endpoint | รายละเอียด |
|---|---|---|
| POST | `/api/auth/login` | เข้าสู่ระบบ และรับ JWT Token |
| GET | `/api/requests` | ดึงรายการแจ้งซ่อม (กรองตามบทบาทอัตโนมัติ) |
| POST | `/api/requests` | สร้างใบแจ้งซ่อมใหม่ |
| PATCH | `/api/requests/:id` | อัปเดตสถานะ/มอบหมายช่าง/ปิดงาน |
| GET | `/api/materials` | ตรวจสอบรายการวัสดุและสต็อก |
| DELETE| `/api/materials/:id` | ลบวัสดุออกจากคลัง (Admin/Manager) |
| GET | `/api/dashboard/stats` | สรุปข้อมูลเชิงสถิติสำหรับหน้า Dashboard |

---

## 🛡️ 12. ความปลอดภัยและการดูแลรักษา (Security & Maintenance)

### 12.1 ระบบความปลอดภัย
1.  **JWT Authentication:** ข้อมูลผู้ใช้ถูกเข้ารหัสใน Token อายุ 7 วัน
2.  **Rate Limiting:** จำกัดการ Login ผิดเกิน 10 ครั้งใน 15 นาที เพื่อป้องกัน Brute-force
3.  **NoSQL Security:** `firestore.rules` ถูกตั้งค่าเป็น `Deny All` เพื่อบังคับให้เข้าข้อมูลผ่าน API ที่มีการตรวจสอบสิทธิ์เท่านั้น
4.  **HTTPS / Helmet:** ระบบบังคับใช้ HTTPS และมี Security Headers ป้องกันการโจมตีเว็บพื้นฐาน

### 12.2 คู่มือการตั้งค่า SMTP (Email)
เพื่อให้การแจ้งเตือนทำงานได้จริง กรุณาไปที่หน้า **"ตั้งค่าระบบ"** และกรอกข้อมูลดังนี้:
- **Host:** เช่น `smtp.gmail.com`
- **Port:** `465` (SSL) หรือ `587` (TLS)
- **User/Pass:** อีเมลและรหัสผ่านของผู้ส่ง (Gmail ต้องใช้ App Password)

---

## 🚀 13. ขั้นตอนการติดตั้ง (Deployment)

1.  **Firebase Setup:** สร้าง Project ใน Firebase Console และจด Project ID
2.  **Environment:** ในโฟลเดอร์ `backend` ให้ตั้งค่าค่าคงที่ผ่าน Cloud Console เช่น `JWT_SECRET`
3.  **Command:**
    ```bash
    npm install -g firebase-tools
    firebase login
    firebase use --add YOUR_PROJECT_ID
    firebase deploy
    ```

---
> **Master Edition Note:** ระบบนี้ได้รับการปรับปรุงโดยการตัดส่วน PO และ SMS (Twilio/Resend) ออก เพื่อเน้นความเบาและเสถียรที่สุดในการใช้งานในสภาพแวดล้อมจริง

## 👨‍💻 ผู้พัฒนา
- ทีมงาน SDDI - Maintenance Management System 2025
## 16. คณะผู้จัดทำ (Project Team)

| รหัสนักศึกษา | ชื่อ-นามสกุล              | ตำแหน่ง                     |
|---------------|----------------------------|-----------------------------|
| 68030282      | นายศุภโชค หอมสมบัติ       | Development Manager         |
| 68030263      | นายวสุรัชต์ สมเด็จ         | Backend Developer           |
| 68030265      | นายวัฒนพงศ์ พรหมภิราม    | UI/UX Design & Front-End    |
| 68030258      | นางสาววรัทยา รอดเมล์     | UI/UX Design & Front-End    |
| 68030262      | นายวศิน แก้วมรกต          | UI/UX Design & Front-End    |
| 68030271      | นายวีระภัทร อ่วมเกษม      | Quality Assurance (QA)      |
| 68030288      | นายสรวิชญ์ สิทธิรักษ์      | Tester                      |

