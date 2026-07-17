---
title: Shell 脚本语言学习笔记
published: 2025-07-07
description: 从基础命令到实战案例，系统梳理 Shell 脚本编程的核心知识点，包含变量、数据检索、自动化部署、服务监控等实用脚本。
tags: [Shell, Linux, 脚本, 自动化, 运维]
category: 学习笔记
slug: shell-script-notes
---

# Shell 脚本语言学习笔记

---

## 一、基础命令

### 1. echo 命令

`echo` 命令用于在屏幕上显示信息，也可以将内容输出到文件。

```bash
echo test                    # 在屏幕上输出 test
echo test > 1.txt            # 将 test 输出到 1.txt 文件中（覆盖写入）
echo test >> 1.txt           # 将 test 输出到 1.txt 文件中（追加写入）
cat 1.txt                   # 将 1.txt 文件的内容输出到屏幕上
```

**说明：**
- `>`：如果文件不存在则创建，如果文件存在则**覆盖**文件内容
- `>>`：如果文件不存在则创建，如果文件存在则**追加**文件内容

---

### 2. 数据检索和编辑命令

```bash
netstat -nltp                # 显示所有监听端口和已连接端口，包括进程ID
netstat -nltp | grep 80      # 显示包含 80 端口的连接信息
```

---

### 3. 行检索命令

```bash
grep 80 1.txt                # 在 1.txt 文件中检索包含 80 的行
```

---

### 4. 字符串检索

```bash
awk '{print $1}' work/com/1.txt    # 打印该文件每行的第一列字段
```

---

### 5. 交互式与非交互式命令

| 类型 | 命令 | 说明 |
|------|------|------|
| 交互式 | `vim 1.txt` | 在 vim 编辑器中打开 1.txt 文件 |
| 非交互式 | `sed -i 's/test/123/g' 1.txt` | 直接修改文件内容，全局替换 |

**sed 命令说明：**
```bash
sed -i 's/test/123/g' 1.txt
# -i：直接修改文件内容
# s：替换命令
# g：全局替换（global）
```

---

## 二、脚本基础

### 1. 脚本文件规范

- Shell 脚本以 `.sh` 或 `.bash` 结尾
- 脚本中 `#` 表示注释，不会执行
- 脚本首行指定解释器：`#!/bin/bash`

### 2. 执行脚本的方式

```bash
bash 1.sh                    # 方式一：使用 bash 命令执行
chmod +x 1.sh                # 方式二：先添加执行权限
./1.sh                       # 然后直接执行
```

---

## 三、变量

### 1. 变量命名规则

1. 变量名只能以字母或下划线开头
2. 变量名只能包含字母、数字和下划线
3. 变量名不能以数字开头

### 2. 变量定义与使用

```bash
a=10                         # 定义变量 a，赋值为 10
echo $a                      # 输出变量 a 的值，即 10
echo a                       # 输出字符串 "a"，而不是变量值

a=$b                         # 将变量 b 的值赋值给变量 a
echo $a                      # 输出变量 a 的值，即 b 的值
```

### 3. 时间变量

```bash
shijian=$(date)              # 将当前时间赋值给变量 shijian
echo $shijian                # 输出当前时间

shijian=$(date +%y%m%d_%H%M%S)    # 格式：年月日_时分秒
echo $shijian

time=$(date +%y年%m月%d日_%H时%M分%S秒)    # 中文格式
echo $time
```

---

## 四、脚本案例

### 案例 1：服务器初始化配置

**功能：** 关闭 SELinux、防火墙、安装常用软件

```bash
#!/bin/bash
# 作者：张三
# 日期：2023-08-01
# 描述：服务器初始化配置脚本
# 版本：1.0.0

setenforce 0                        # 关闭 SELinux 强制模式
sed -i 's/enforcing/disabled/g' /etc/selinux/config    # 修改 SELinux 配置文件

echo "已关闭 selinux"

systemctl stop firewalld            # 关闭防火墙服务
systemctl disable firewalld         # 禁用防火墙服务开机自启

echo "已关闭防火墙"

yum install vim tar unzip net-tools wget nginx php php-fpm php-zip php-gd php-intl php-mysqlnd -y
# yum 安装常用软件包

echo "已安装常用软件"
echo "已完成服务器初始化配置!"
```

---

### 案例 2：自动备份双副本数据库

**功能：** 每天凌晨自动备份数据库，压缩后存储到本地和 NFS 共享服务器，清理 30 天前的本地备份

```bash
#!/bin/bash
# FileName: dbbackup.sh
# Version: 1.0
# Date: 2025-07-06
# Author: baige
# Description: the script for backup mysql of opencart

shijian=`date +%y%m%d_%H%M%S`        # 注意使用反引号 ` 执行命令

# 数据库备份
# -u：用户名 -p：密码 数据库名 > 备份文件路径
mysqldump -uroot! -p2wsx#EDC oc202505 > /beifen/opencart.sql 2> /dev/null
# 2> /dev/null：将错误输出重定向到空设备，不显示任何信息

# 压缩备份文件并删除原文件
tar -czf /beifen/yasuo-$shijian.tar.gz /beifen/opencart.sql --remove-files 2> /dev/null
# -czf：创建压缩文件（c-create, z-gzip, f-file）
# --remove-files：压缩后删除原文件

# 同步到 NFS 共享服务器（双保险）
rsync /beifen/* /mnt/nfs_share

# 删除本地 30 天前的备份文件
find /beifen/ -mtime +30 | xargs rm -rf
# -mtime +30：修改时间超过 30 天的文件

# 记录日志
echo "well done! 备份时间为 $shijian" >> /shell/beifen.log
```

**验证方法：**

```bash
chmod +x dbbackup.sh               # 给脚本添加执行权限
./dbbackup.sh                      # 执行脚本

# 查看本地备份目录
ls -alh                            # 显示所有文件，包括隐藏文件，长格式，人类可读大小

# 查看共享目录信息
df -hT                             # 显示文件系统类型、已用空间、总空间、可用空间、已用率

# 查看日志文件
cat /shell/beifen.log              # 显示备份日志内容
```

---

### 案例 3：自动化部署邮件服务

**功能：** 输入邮箱账户和授权密码，一键完成邮件服务部署

```bash
#!/bin/bash
# FileName:     smtp.sh
# Version:      1.0
# Date:         2025-07-07
# Author:       baige
# Description:  the script for smtp configuration

# 提示：邮箱需要开启 SMTP 服务，并获取授权码

read -p "请输入邮箱服务商 [163/qq/126]: " provider    # 读取用户输入的邮箱服务商
read -p "请输入邮箱账号: " account                    # 读取用户输入的邮箱账号
read -p "请输入邮箱授权码: " password                 # 读取用户输入的授权码

echo "正在安装邮件服务 ... "

yum install mailx sendmail -y > /dev/null            # 安装 mailx 和 sendmail 软件包

# 配置邮件客户端
cat >> /etc/mail.rc << EOF
set from=$account@$provider.com                      # 设置发件人邮箱地址
set smtp=smtp.$provider.com                          # 设置 SMTP 服务器地址
set smtp-auth-user=$account                          # 设置邮箱账号
set smtp-auth-password=$password                     # 设置授权密码
set smtp-auth=login                                  # 设置认证方式
EOF

systemctl start sendmail                             # 启动 sendmail 服务
```

**测试方法：**

```bash
echo "测试内容" | mail -s "测试主题" baige_zhynet@189.cn
# -s：指定邮件主题
# 将测试内容发送到指定邮箱
```

---

### 案例 4：自动化监测恶意访问

**功能：** 每小时检查 Web 访问日志，统计访问次数最多的 IP，如果超过 10000 次则发送邮件告警

```bash
fwq=`cat /etc/hostname`                              # 获取服务器主机名

zdljs=`awk '{print $1}' /shell/log/access.log | sort -n | uniq -c | sort -rn | head -1 | awk '{print $1}'`
# awk '{print $1}'：提取 IP 地址
# sort -n：排序
# uniq -c：去重并统计次数
# sort -rn：按次数从大到小排序
# head -1：取访问次数最多的记录
# awk '{print $1}'：提取访问次数

gjip=`awk '{print $1}' /shell/log/access.log | sort -n | uniq -c | sort -rn | head -1 | awk '{print $2}'`
# awk '{print $2}'：提取 IP 地址

# 记录日志
echo -e "\n`date +%m月%d日 %H时%M分`最大连接数是 $zdljs 访问者IP地址是 $gjip" >> /shell/log/anti-dos.log

# 判断是否超过阈值并发送告警
if [ $zdljs -gt 10000 ]
then
    echo "警告,服务器 $fwq 要炸,连接数达到 $zdljs,攻击地址为 $gjip" | mail -s "服务器受 dos 攻击警告" baige_zhynet@189.cn
fi
```

---

### 案例 5：自动化监测 Nginx 服务

**功能：** 持续监测 Nginx 服务状态，如果异常则自动重启

```bash
#!/bin/bash

while true                    # 无限循环
do
    if ! netstat -nltp | grep 80 > /dev/null    # 判断端口 80 是否正常监听
    then
        # Nginx 异常，重启服务
        echo "$(date +%y年%m月%d日%H时%M分%S秒) - Nginx 停止运行,正在重启 ... " | tee -a /shell/log/nginx_error.log
        systemctl restart nginx
    else
        # Nginx 正常运行
        echo "$(date +%y年%m月%d日%H时%M分%S秒) - Nginx 正常运行" | tee -a /shell/log/nginx_normal.log
    fi
    sleep 3                   # 每 3 秒检查一次
done
```

**相关命令：**

```bash
systemctl status nginx        # 查看 Nginx 服务状态
systemctl restart nginx       # 重启 Nginx 服务
systemctl stop nginx          # 停止 Nginx 服务

cat /shell/log/nginx_error.log    # 查看异常日志
cat /shell/log/nginx_normal.log   # 查看正常运行日志
```

---

## 五、常用命令汇总

| 命令 | 功能 |
|------|------|
| `echo` | 输出信息 |
| `cat` | 显示文件内容 |
| `grep` | 检索匹配内容 |
| `awk` | 文本处理 |
| `sed` | 流编辑 |
| `netstat` | 网络状态 |
| `systemctl` | 系统服务管理 |
| `yum` | 包管理 |
| `tar` | 文件压缩 |
| `rsync` | 文件同步 |
| `find` | 文件查找 |
| `date` | 日期时间 |
| `mail` | 邮件发送 |
