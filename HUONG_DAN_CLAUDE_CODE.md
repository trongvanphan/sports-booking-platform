# Hướng Dẫn Sử Dụng Claude Code

## Mục Lục
- [Cơ Bản](#cơ-bản)
- [Nâng Cao](#nâng-cao)
- [Best Practices](#best-practices)

---

## Cơ Bản

### Claude Code là gì?

Claude Code là công cụ CLI (Command Line Interface) giúp bạn làm việc với code bằng AI. Nó có thể:
- Đọc và sửa code
- Chạy lệnh terminal
- Tạo và commit code
- Debug và fix lỗi
- Tương tác với Git/GitHub

### Cách mở Claude Code

```bash
# Trong terminal, cd đến thư mục project
cd /path/to/project

# Mở Claude Code
claude
```

### Các lệnh cơ bản

| Lệnh | Mô tả |
|------|-------|
| `/help` | Xem tất cả lệnh có sẵn |
| `/clear` | Xóa context, bắt đầu session mới |
| `/exit` | Thoát Claude Code |
| `/init` | Tạo file CLAUDE.md tự động |
| `/permissions` | Quản lý quyền cho tools |

### Cách giao tiếp cơ bản

```bash
# Ví dụ 1: Hỏi về code
"giải thích function này làm gì?"

# Ví dụ 2: Yêu cầu sửa code
"sửa lỗi type error trong file App.tsx"

# Ví dụ 3: Yêu cầu tạo code mới
"tạo component React cho form login"

# Ví dụ 4: Chạy lệnh
"chạy npm install và fix lỗi nếu có"
```

---

## Nâng Cao

### 1. Custom Slash Commands

Tạo commands riêng trong `.claude/commands/`:

```bash
# Tạo file .claude/commands/fix-lint.md
```

Nội dung file:
```markdown
Fix tất cả lint errors:
1. Chạy eslint
2. Fix từng lỗi một
3. Verify lại
4. Commit khi xong
```

Sử dụng:
```bash
/fix-lint
```

### 2. Sử dụng Arguments trong Commands

```markdown
<!-- .claude/commands/test-feature.md -->
Test feature: $ARGUMENTS

1. Find tests related to $ARGUMENTS
2. Run those tests
3. Report results
```

Sử dụng:
```bash
/test-feature authentication
```

### 3. Multi-Session Workflow

Chạy nhiều Claude cùng lúc:

```bash
# Terminal 1
cd project-auth && claude

# Terminal 2
cd project-ui && claude

# Terminal 3
cd project-api && claude
```

### 4. Headless Mode (Automation)

```bash
# Chạy Claude không cần tương tác
claude -p "fix all lint errors" --allowedTools Edit,Bash

# Với JSON output
claude -p "analyze code" --output-format json
```

### 5. Git Worktrees

Làm việc nhiều branch cùng lúc:

```bash
# Tạo worktree
git worktree add ../project-feature-a feature-a

# Mở Claude trong worktree
cd ../project-feature-a && claude
```

### 6. Pipe Data vào Claude

```bash
# Pipe file
cat log.txt | claude "analyze these logs"

# Pipe output lệnh
npm run lint 2>&1 | claude "fix these errors"
```

---

## Best Practices

### 1. Customize với CLAUDE.md

**Tạo file `CLAUDE.md` ở root project:**

```markdown
# Project Setup

## Bash Commands
- `npm run dev`: Start dev server
- `npm run build`: Build production
- `npm run test`: Run tests

## Code Style
- Use TypeScript strict mode
- Prefer composition over inheritance
- No console.log in production code

## Workflow
- Always run tests before commit
- Use conventional commits
- Update CHANGELOG.md for breaking changes

## Important Files
- `src/config.ts`: Main configuration
- `src/utils/api.ts`: API utilities
```

**Các vị trí CLAUDE.md:**
- `CLAUDE.md` - Root project (recommended, commit vào git)
- `CLAUDE.local.md` - Root project (local only, .gitignore)
- `~/.claude/CLAUDE.md` - Global cho tất cả projects

### 2. Workflow: Explore → Plan → Code → Commit

**Bước 1: Explore**
```
"đọc file auth.tsx và utils.ts để hiểu cách authentication hoạt động,
nhưng chưa viết code gì cả"
```

**Bước 2: Plan**
```
"dựa trên những gì đã đọc, lập kế hoạch implement feature refresh token.
Dùng từ khóa 'think' để suy nghĩ kỹ trước"
```

**Bước 3: Code**
```
"thực hiện theo kế hoạch trên, viết code để implement refresh token"
```

**Bước 4: Commit**
```
"commit những thay đổi với message rõ ràng"
```

### 3. Workflow: Test-Driven Development (TDD)

**Bước 1: Viết test trước**
```
"viết test cho function calculateDiscount(), test các case:
- discount = 0% khi quantity < 10
- discount = 10% khi quantity >= 10
- discount = 20% khi quantity >= 50
KHÔNG viết implementation code, chỉ viết test"
```

**Bước 2: Confirm test fail**
```
"chạy test và confirm rằng test fail (vì chưa có implementation)"
```

**Bước 3: Commit test**
```
"commit test code"
```

**Bước 4: Viết implementation**
```
"viết implementation để pass test, không sửa test"
```

**Bước 5: Commit code**
```
"commit implementation code"
```

### 4. Workflow: Visual Design

**Bước 1: Cho Claude xem design**
```
# Paste hoặc drag-drop image vào
"đây là design mockup, cần implement bằng React + Tailwind"
```

**Bước 2: Implement và screenshot**
```
"implement design này, sau đó chụp screenshot và so sánh với mockup,
chỉnh sửa cho đến khi giống"
```

### 5. Tips quan trọng

**Be Specific**
```
❌ "fix bug trong auth"
✅ "fix lỗi authentication bị fail khi user password có ký tự đặc biệt.
   File liên quan: src/lib/auth.ts line 45-60"
```

**Mention files explicitly**
```
❌ "tôi muốn sửa lỗi trong file này"
✅ "sửa lỗi type error trong [src/components/Header.tsx](src/components/Header.tsx)"
```

**Use images**
```
# Screenshot design mock
"implement theo design này"

# Screenshot error
"fix lỗi này"

# Screenshot UI để debug
"UI bị lệch, căn lại cho đúng"
```

**Course correct early**
```
# Escape - Dừng Claude đang chạy
# Double Escape - Edit prompt trước đó
# "undo" - Hoàn tác thay đổi
```

**Use /clear thường xuyên**
```
# Giữ context focused, tránh context đầy
"clear và bắt đầu task mới"
```

### 6. Safe YOLO Mode

⚠️ **Chỉ dùng khi hiểu rõ rủi ro!**

```bash
# Bỏ qua tất cả permissions - RỦI RO CAO!
claude --dangerously-skip-permissions

# Better: Dùng trong container không internet
docker run -it --network none your-image claude --dangerously-skip-permissions
```

### 7. Multi-Claude Patterns

**Pattern 1: Writer + Reviewer**
```bash
# Terminal 1 - Writer
claude
"viết function để parse CSV file"

# Terminal 2 - Reviewer (sau khi terminal 1 xong)
claude
"review code trong src/parser/csv.ts, tìm bug và suggest improvements"
```

**Pattern 2: Parallel Worktrees**
```bash
# Tạo 3 worktrees
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b
git worktree add ../project-bugfix bugfix-123

# Mở Claude trong mỗi worktree
cd ../project-feature-a && claude  # Terminal 1
cd ../project-feature-b && claude  # Terminal 2
cd ../project-bugfix && claude     # Terminal 3
```

### 8. Tối ưu Performance

**Sử dụng permissions để tránh prompt:**
```bash
# Edit settings.json
{
  "allowedTools": [
    "Edit",
    "Read",
    "Bash(git:*)",
    "Bash(npm:*)",
    "Bash(npx:*)"
  ]
}
```

**Hoặc dùng /permissions:**
```bash
/permissions
# Add: Edit
# Add: Bash(git commit:*)
# Add: Bash(npm:*)
```

### 9. Use MCP Servers

Claude Code có thể kết nối với MCP servers để mở rộng capabilities:

```json
// .mcp.json trong project
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"]
    }
  }
}
```

### 10. Troubleshooting

**Claude không tìm thấy file?**
```bash
# Dùng path tuyệt đối hoặc tab-completion
"đọc file /Users/trongpv6/Documents/GitHub/STUDY/sports-booking-platform/web/app/page.tsx"
```

**Context quá đầy?**
```bash
/clear
"bắt đầu task mới, reset context"
```

**Claude chạy lệnh sai?**
```
# Dừng ngay (Escape)
"dừng lại, chạy lệnh này thay vì vậy: ..."
```

**Need more thinking time?**
```
# Sử dụng extended thinking keywords
"think hard về vấn đề này"
"think harder để tìm solution tốt nhất"
"ultrathink cho complex architecture"
```

---

## Quick Reference

### Keyboard Shortcuts
- `Ctrl+C` - Interrupt Claude
- `Ctrl+D` - Exit Claude Code
- `Tab` - Toggle auto-accept mode
- `Escape` - Stop current action
- `Double Escape` - Edit last prompt

### Common Commands
```bash
/help           # Show help
/clear          # Clear context
/init           # Initialize CLAUDE.md
/permissions    # Manage permissions
/exit           # Exit
```

### File References
```bash
# Reference file in conversation
"đọc [src/App.tsx](src/App.tsx)"

# Reference multiple files
"đọc [src/components/*.tsx](src/components/)"

# Reference folder
"kiểm tra thư mục [tests/](tests/)"
```

---

## Resources

- [Official Documentation](https://claude.ai/code)
- [GitHub Repository](https://github.com/anthropics/claude-code)
- [Best Practices Blog](https://www.anthropic.com/engineering/claude-code-best-practices)

---

**Tip:** Lưu file này vào project của bạn để tham khảo nhanh!
