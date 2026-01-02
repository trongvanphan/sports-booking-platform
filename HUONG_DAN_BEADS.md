# Hướng Dẫn Sử Dụng Beads - Công Cúc Quản Lý Task Cho AI Agent

## 📖 Beads Là Gì?

**Beads** là một hệ thống theo dõi công việc dạng đồ thị (graph-based issue tracker) được thiết kế đặc biệt cho AI/Coding Agent. Nó lưu trữ tasks dưới dạng JSON trong thư mục `.beads/` và sử dụng Git như database.

### Tại Sao Beads Hay?

- ✅ **Lưu trữ trên Git** - Tất cả tasks được version control như code
- ✅ **Theo dõi dependencies** - Biết task nào chặn task nào
- ✅ **Tự động detect task sẵn sàng** - Agent biết task nào có thể làm ngay
- ✅ **Không bị conflict** - Dùng hash-based IDs tránh xung đột khi merge
- ✅ **SQLite cache** - Nhanh nhờ local database
- ✅ **Compaction** - Tự động tóm tắt tasks cũ để tiết kiệm context

---

## 🚀 Cài Đặt

### macOS / Linux

```bash
# Cách 1: Dùng install script (khuyến nghị)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Cách 2: Dùng npm
npm install -g @beads/bd

# Cách 3: Dùng Homebrew
brew install steveyegge/beads/bd

# Cách 4: Dùng Go (nếu có Go)
go install github.com/steveyegge/beads/cmd/bd@latest
```

### Windows

```bash
# Dùng npm
npm install -g @beads/bd

# Hoặc download binary từ GitHub Releases
```

### Kiểm Tra Cài Đặt

```bash
bd --version
# Hoặc
bd help
```

---

## 🎯 Khởi Tạo Project

### Khởi Tạo Mới

```bash
# Trong thư mục project của bạn
bd init
```

Lệnh này sẽ tạo:
- Thư mục `.beads/` - nơi lưu tasks
- File `.beads/config` - cấu hình Beads

### Stealth Mode (Dành Cho Local Development)

```bash
# Không commit file beads vào repo chính
bd init --stealth
```

Chế độ này hữu ích khi bạn muốn dùng Beads cá nhân trên project chia sẻ mà không commit file beads.

---

## 📋 Các Lệnh Cơ Bản

### 1. Xem Tasks Sẵn Sàng Làm

```bash
# Liệt kê các tasks không có blocker
bd ready
```

Output:
```
✔ bd-a1b2 (ready) - Implement user authentication
✔ bd-c3d4 (ready) - Create venue listing page
```

### 2. Tạo Task Mới

```bash
# Tạo task với priority (P0 = cao nhất)
bd create "Add login form" -p 0

# Tạo task không có priority
bd create "Fix header alignment"
```

Priority levels:
- `0` (P0) - Cao nhất
- `1` (P1) - Cao
- `2` (P2) - Trung bình
- `3` (P3) - Thấp

### 3. Xem Chi Tiết Task

```bash
bd show bd-a1b2
```

Output:
```
ID: bd-a1b2
Title: Add login form
Status: open
Priority: 0
Created: 2024-01-15T10:30:00Z
```

### 4. Thêm Dependencies

```bash
# Thêm blocker: child bị chặn bởi parent
bd dep add bd-child bd-parent

# Thêm related: liên quan nhưng không chặn
bd dep add bd-task1 bd-task2 --related

# Thêm parent: parent task
bd dep add bd-subtask bd-parent --parent
```

### 5. Cập Nhật Task

```bash
# Thay đổi status
bd update bd-a1b2 --status closed

# Thay đổi priority
bd update bd-a1b2 --priority 1

# Thêm description
bd update bd-a1b2 --desc "Implement OAuth2 login with Google"
```

Status values:
- `open` - Mới
- `ready` - Sẵn sàng làm
- `started` - Đang làm
- `blocked` - Bị chặn
- `closed` - Hoàn thành

### 6. Liệt Kê Tasks

```bash
# Tất cả tasks
bd list

# Chỉ tasks đang mở
bd list --status open

# Tasks theo priority
bd list --priority 0

# Tasks bị chặn
bd list --blocked
```

### 7. Delete Task

```bash
bd delete bd-a1b2
```

---

## 🏗️ Cấu Trúc Task Phức Tạp

### Hierarchical IDs (Epic → Task → Sub-task)

```
bd-a3f8          → Epic
bd-a3f8.1        → Task trong Epic
bd-a3f8.1.1      → Sub-task
bd-a3f8.1.2      → Sub-task
```

### Tạo Task Trong Epic

```bash
# Tạo Epic
bd create "Build User Authentication Module" -p 0

# Tạo task trong Epic
bd create "Add sign up form" -p bd-a3f8

# Tạo sub-task
bd create "Design form UI" -p bd-a3f8.1
```

### Dependencies Ví Dụ

```
bd-a1b2: Deploy to production
  └─ blocked by → bd-b2c3: Run tests
                      └─ blocked by → bd-c3d4: Fix login bug
```

Tạo dependencies:

```bash
bd dep add bd-b2c3 bd-c3d4  # tests bị chặn bởi fix
bd dep add bd-a1b2 bd-b2c3  # deploy bị chặn bởi tests
```

---

## 🔄 Workflow Cho AI Agent

### Bước 1: Agent Xem Tasks Sẵn Sàng

```bash
bd ready
```

Agent lấy output này để biết task nào có thể làm ngay.

### Bước 2: Agent Bắt Đầu Làm Task

```bash
bd update bd-a1b2 --status started
```

### Bước 3: Agent Hoàn Thành Task

```bash
bd update bd-a1b2 --status closed
```

### Bước 4: Kiểm Tra Task Tiếp Theo

```bash
bd ready
```

Vì task cũ đã `closed`, task mới có thể `ready`.

---

## 🌳 Sync Với Git

### Commit Tasks Vào Git

```bash
# Sau khi tạo/cập nhật tasks
bd sync

# Hoặc tự động khi bạn git commit (nếu được cấu hình)
git add .beads/
git commit -m "Update task list"
```

### Push Lên Remote

```bash
git push origin main
```

Tasks trong `.beads/` sẽ được push như code bình thường.

---

## 🔧 Cấu Hình Nâng Cao

### File Config `.beads/config`

```toml
# Tên project
project = "My Sports Booking App"

# Branch chứa beads
branch = "main"

# Enable stealth mode
stealth = false

# Auto-sync với git
auto_sync = true

# Compaction settings
[compaction]
  enabled = true
  days = 7  # Tóm tắt tasks sau 7 ngày
```

### Environment Variables

```bash
# Chỉ định thư mục beads
export BEADS_DIR="$HOME/.beads"

# Debug mode
export BEADS_DEBUG=true
```

---

## 📊 Compaction - Tóm Tắt Tasks Cũ

Beads tự động tóm tắt (compact) tasks đã đóng để tiết kiệm context window.

### Cấu Hình Compaction

```bash
# Xem config compaction
bd config compaction

# Bật compaction
bd config compaction --enable

# Thiết lập số ngày giữ detail
bd config compaction --days 7
```

Tasks đã đóng > 7 ngày sẽ được tóm tắt thành 1 dòng summary.

---

## 🤤 Tích Hợp Với AI Agent

### Claude Code / Claude Desktop

Thêm vào `AGENTS.md`:

```markdown
# Task Tracking

Sử dụng Beads để theo dõi tiến độ:
- Chạy `bd ready` để xem tasks sẵn sàng
- Cập nhật task status khi bắt đầu/hoàn thành
- Thêm dependencies khi task bị chặn
```

### OpenAI ChatGPT / Code Interpreter

Sử dụng CLI commands:

```python
import subprocess

def get_ready_tasks():
    result = subprocess.run(['bd', 'ready'], capture_output=True, text=True)
    return result.stdout

def create_task(title, priority=0):
    subprocess.run(['bd', 'create', title, '-p', str(priority)])

def close_task(task_id):
    subprocess.run(['bd', 'update', task_id, '--status', 'closed'])
```

---

## 🐛 Troubleshooting

### Lỗi: Command not found

```bash
# Kiểm tra installation
which bd

# Reinstall
npm install -g @beads/bd
```

### Lỗi: Permission denied

```bash
# Thêm execute permission
chmod +x /usr/local/bin/bd
```

### Lỗi: Sync failed

```bash
# Reset sync
bd sync --reset

# Hoặc re-init
bd init --force
```

### Xem Debug Info

```bash
BD_DEBUG=1 bd ready
```

---

## 💡 Mẹo Sử Dụng

### 1. Alias Cho Lệnh Thường Dùng

```bash
# Thêm vào ~/.zshrc hoặc ~/.bashrc
alias bdr='bd ready'
alias bdl='bd list'
alias bds='bd show'
```

### 2. Tạo Nhiều Tasks Cùng Lúc

```bash
# Dùng xargs hoặc shell script
for task in "Task 1" "Task 2" "Task 3"; do
  bd create "$task" -p 1
done
```

### 3. Export Tasks Ra Markdown

```bash
bd list --format md > TASKS.md
```

### 4. Import Tasks Từ File

```bash
# Tạo tasks từ JSON file
bd import tasks.json
```

---

## 📚 Tài Liệu Tham Khảo

- **GitHub**: https://github.com/steveyegge/beads
- **Docs**: https://github.com/steveyegge/beads/tree/main/docs
- **Community Tools**: UI, extensions, integrations

---

## 🎓 Ví Dụ Workflow Hoàn Chỉnh

```bash
# 1. Khởi tạo
bd init

# 2. Tạo Epic
bd create "Xây dựng trang booking" -p 0

# 3. Tạo tasks
bd create "Tạo form đăng ký" -p bd-a1b2
bd create "Tạo form đăng nhập" -p bd-a1b2
bd create "Tạo trang profile" -p bd-a1b2

# 4. Xem tasks sẵn sàng
bd ready

# 5. Agent làm task
bd update bd-a1b2.1 --status started
# ... code ...
bd update bd-a1b2.1 --status closed

# 6. Sync với git
bd sync
git commit -m "Complete sign up form"
```

---

**Chúc bạn sử dụng Beads hiệu quả cho AI agent của mình! 🚀**
