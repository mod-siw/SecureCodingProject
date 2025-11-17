# SecureCodingProject

25-2 시큐어코딩및실습 팀 프로젝트 과제

## 🚀 로컬에서 실행하기

이 프로젝트는 Vercel Postgres/Blob을 백엔드로 사용하므로, Vercel CLI 연동이 **필수**입니다.

---

## 로컬 실행 명령어 (순서대로)

### 1. 프로젝트 코드 클론

```bash
git clone [https://github.com/mod-siw/SecureCodingProject](https://github.com/mod-siw/SecureCodingProject)
cd SecureCodingProject
```

### 2. npm 패키지 설치


```
npm install
```

### 3. Vercel 프로젝트 연결
[필수] Vercel 대시보드에서 새 프로젝트를 생성하고, Postgres와 Blob을 생성 및 연결해야 합니다.

아래 명령어를 실행하여 로컬 폴더를 Vercel 프로젝트에 연결합니다.

```
# Vercel CLI 설치 (최초 1회)
npm install -g vercel

# Vercel 계정 로그인 (최초 1회)
vercel login

# 로컬 폴더를 Vercel 프로젝트에 연결
# (CLI 질문에 따라 생성해둔 Vercel 프로젝트를 선택)
vercel link
```

### 4. Vercel에 저장된 DB/Blob 키 로컬 생성
```

# .env.development.local 파일을 자동 생성합니다.
vercel env pull .env.development.local
```
### 5. 로컬 개발 서버 실행

```npm run dev```

### 6. 데이터베이스 초기화 (최초 1회)
서버가 실행된 상태에서, 브라우저를 열어 아래 주소로 반드시 1회 접속합니다.

이 과정은 Vercel DB에 users, posts 등 필요한 테이블을 생성합니다.

접속 URL: ```http://localhost:3000/api/init```

(브라우저에 {"message":"Database initialized successfully"}가 보이면 성공입니다.)

이제 http://localhost:3000에 접속하여 로컬 테스트를 시작할 수 있습니다.

---
## ‼️프로젝트를 위한 추가 안내 사항 ‼️
    해당 프로젝트는 개인 계정 Vercel을 사용하여... 직접 인증은 어려울 것 같아서, 요청 주시면 env 파일 공유하는 쪽으로 하겠습니다!

    가능하다면 코드는 참조만 하고 배포 화면에서 테스트해주시면 좋을 것 같습니다🥲

    어려울 경우에는 그 사이에 서버 배포 연결 없는 코드로 수정해보도록 하겠습니다!



### ⚠️ 중요: 환경 변수

`vercel env pull`로 생성된 `.env.development.local` 파일은 **본인의 비밀 키**입니다. **절대로 이 파일을 다른 사람에게 공유하거나 Git에 푸시하지 마세요.**
