# 共享充电系统采购询价单
## Charging Dock & Power Bank RFQ - Integrated System

---

## 项目背景 Project Background

新客户采购智能充电柜与配套充电宝系统，用于共享充电宝租赁业务。本项目面向欧洲市场。

New client procurement of intelligent charging dock and matching power bank system for shared power bank rental business. This project targets the European market.

### 项目参数 Project Parameters

| 项目 Item | 规格 Specification |
|-----------|-------------------|
| 产品名称 Product Name | 智能充电系统 |
| 应用场景 Application | 共享充电宝租赁 Shared Power Bank Rental |
| 目标市场 Target Market | 欧洲 Europe |
| 认证要求 Certifications | CE (Mandatory) |

### 年需求量 Annual Volume Forecast

- **充电柜 Charging Docks:** 约80台/年 (~80 units/year)
- **充电宝 Power Banks:** 约2,000个/年 (~2,000 units/year)
- **首单 Trial Order:** 充电柜20台 + 充电宝500个

> 💡 **设计理念 Design Philosophy:**
> 高可靠性、防盗安全、用户友好、易于维护
> High reliability, anti-theft security, user-friendly, easy maintenance

---

## 充电柜技术规格 Charging Dock Technical Specifications

### 基础参数 Basic Parameters

| 参数 Parameter | 详情 Details |
|------------------|--------------|
| 槽位配置 Slot Config | 6槽/柜，可扩展至12槽 (6 slots, expandable to 12) |
| 尺寸 Dimensions | 200mm(深) × 200mm(高) × 135mm(宽) |
| 充电方式 Charging | 弹针接触 (Pogo Pin Contact) |
| 输入电压 Input | 12V DC |
| 单槽输出 Output | 5V 1A (NO fast charging) |
| 充电时间 Charge Time | 1-1.5小时/槽 |
| 通讯接口 Communication | UART Serial Port |
| 机身材质 Housing | ABS+PC 防火材料 |

> **配置灵活** - 可为单柜10槽，或双柜各8槽配置
> **Flexible configuration** - can be single 10-slot or dual 8-slot per dock

### 详细功能列表 Detailed Functionality List

#### 🔌 充电系统 Charging System
- 纯弹针充电设计，机柜无任何USB充电接口
- **Pure pogo pin charging, NO USB ports on dock**
- 每槽独立充电管理，互不干扰
- **Independent charging management per slot**

#### 🔒 安全锁止 Security Locking
- 金属锁扣机制 (Metal latch mechanism)
- 防盗设计，防止暴力撬取电池
- **Anti-theft design, prevents forced battery removal**
- 锁扣配合电池外壳沟槽使用
- **Works with battery shell grooves**

#### 📡 通讯功能 Communication
- UART串口数据输出
- **可读取数据 Readable data:**
  - 电池序列号 Battery Serial Number ✅ (REQUIRED)
  - 电池电量 Battery Level ⭐ (NTH - Nice To Have)
  - 循环次数 Cycle Count ⭐ (NTH)
  - 电池释放状态 Release Status ⭐ (NTH)
  - 电池在位检测 Presence Detection ⭐ (NTH)

#### 🎵 用户反馈 User Feedback
- 电池正确插入时触发提示音
- **Audio confirmation when battery inserted correctly**
- LED状态指示灯 (蓝/红/绿)
- **LED status indicators (Blue/Red/Green)**

---

## 工程规格细节 Engineering Specifications

为确保产品可靠性与用户体验，充电柜设计需满足以下工程要求：

To ensure product reliability and user experience, charging dock design must meet these engineering requirements:

### 工程要求表 Engineering Requirements Table

| 要求 Requirement | 规格 Specification | 目的 Purpose |
|------------------|-------------------|--------------|
| 弹针接触可靠性 Reliable Pogo Pin Contact | 一次插入可靠接触，无需二次按压 Single-insert reliable contact | 确保充电稳定性 Ensure charging stability |
| 金属锁扣结构 Metal Latch Structure | 金属材质，配合电池沟槽 Metal material, matches battery grooves | 防盗防撬 Anti-theft protection |
| 内部线槽设计 Internal Cable Channel | 加大走线空间，避免线缆干扰 Enlarged cable space, avoids interference | 保证电池顺畅滑入 Ensure smooth battery insertion |
| 弹簧力度校准 Spring Tension Calibration | 水平持握时电池固定，取出力度适中 Fixed when horizontal, moderate removal force | 优化用户体验 Optimize user experience |

---

## 充电宝技术规格 Power Bank Technical Specifications

> ⚠️ **特殊产品警告 Special Product Warning**
>
> 此产品为专用机柜配套电池，**非消费级充电宝**。用户无法自行充电，必须通过机柜弹针充电。
>
> **This is DEDICATED equipment battery, NOT consumer power bank.** Users CANNOT self-charge, ONLY via dock pogo pins.

### 核心规格表 Core Specifications Table

| 规格 Spec | 要求 Requirement |
|-----------|------------------|
| 容量 Capacity | 5000mAh (公差 ±2000mAh，即3000-7000mAh可接受) |
| 电芯类型 Cell Type | 锂离子聚合物 Li-Polymer (需指定品牌 Specify brand) |
| 充电输入 Charging Input | **仅弹针触点 Pogo pin contacts ONLY** |
| 放电输出 Output | 内置三线 Built-in 3 cables: Micro USB + Type-C + Lightning |
| 电源控制 Power Control | 无物理按键 **No physical button** (Always ready) |
| 序列号管理 Serial Number | 每颗唯一SN，UART可读 **Unique per unit, UART readable** |
| 电量显示 Indicator | LED指示灯 LED indicator (4档优选 4-level preferred) |
| 外壳配合 Housing | 金属锁扣沟槽 **Metal latch grooves** |
| 认证 Certification | CE (强制 **Mandatory**) |

### 关键设计说明 Critical Design Notes

#### 🔋 容量说明 Capacity Note
标称5000mAh，接受范围3000-7000mAh。需明确电芯品牌(三星Samsung/LG/ATL/国产)及具体型号。

#### 🔌 无自充设计 No Self-Charging Design
机身上无任何USB/Type-C/Micro USB充电接口。用户无法自行充电，防止流失。

#### 🔢 序列号管理 Serial Number Management
每颗电池烧录唯一SN，通过UART通讯读取。用于：
- 资产追踪 Asset tracking
- 计费统计 Billing statistics
- 防盗追踪 Anti-theft tracking

#### 🚫 无电源键 No Power Button
插入设备自动激活，取出后自动休眠。简化用户操作，降低故障点。

---

## 询价要求 Quotation Requirements

### 充电柜 Charging Dock (20 units)

- [ ] 单价(含运费) Unit price (including shipping)
- [ ] 开模费/NRE费用 Mold/NRE costs
- [ ] 固件开发费 Firmware development fee
- [ ] 是否可用公模? Public mold available?
- [ ] 样品交期 Sample lead time
- [ ] 批量交期(80台) Bulk lead time (80 units)
- [ ] 质保条款 Warranty terms

### 充电宝 Power Bank (500 units)

- [ ] 500个单价 Unit price (500 pcs)
- [ ] 2000个单价 Unit price (2,000 pcs)
- [ ] 电芯品牌及型号 Cell brand & model
- [ ] SN烧录费用 SN programming fee
- [ ] 认证费用 Certification costs
- [ ] 模具情况 Mold status (public/custom)
- [ ] 样品交期 Sample lead time

### 供应商需提供 Supplier Must Provide

📎 公司资料 Company Profile
📎 营业执照 Business License
📎 类似案例 Similar project cases (共享充电宝/充电柜优先)
📎 工厂照片/视频 Factory photos/video
📎 电芯规格书 Cell specifications
📎 现有产品目录 Current product catalog

---

## 联系方式 Contact Information

📧 **资料发送 Please send materials to:**
[Your Email] / [Your WeChat]

📞 **紧急联系 Urgent Contact:**
[Your Phone]

⏰ **回复截止 Response Deadline:**
[Date - suggest 7 days from sending]

---

*详细规格书、尺寸图纸、操作视频可另行提供。*
*Detailed specification, dimension drawings, and operation video available upon request.*

**期待长期合作，谢谢！**
**Looking forward to long-term partnership. Thank you!**

---

*Confidential - For Authorized Suppliers Only*
