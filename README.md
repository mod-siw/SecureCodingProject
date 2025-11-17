# SecureCodingProject

25-2 시큐어코딩및실습 팀 프로젝트 과제

## 🚀 로컬에서 실행하기

### 1. 필수 준비 사항

- Node.js (v18 이상 권장)
- [Vercel 계정](https://vercel.com/signup) (필수)
- [Vercel CLI](https://vercel.com/docs/cli) (설치 가이드 참고)

### 2. 로컬 설정 단계

1.  **Vercel CLI 글로벌 설치**
    아직 설치하지 않았다면, 터미널에서 Vercel CLI를 설치합니다.

    ```bash
    npm install -g vercel
    ```

2.  **프로젝트 클론 및 설치**

    ```bash
    git clone [이 저장소의 URL]
    cd [프로젝트 폴더명]
    npm install
    ```

3.  **Vercel 로그인**
    터미널에서 Vercel 계정에 로그인합니다. 브라우저가 열리며 인증을 요청합니다.

    ```bash
    vercel login
    ```

4.  **Vercel 프로젝트 생성 및 연결 (가장 중요)**
    이 프로젝트는 Vercel의 `POSTGRES_URL`과 `BLOB_READ_WRITE_TOKEN`을 필요로 합니다.

    - **Vercel 대시보드**로 이동하여 **새로운 Vercel 프로젝트**를 생성합니다.
    - 생성한 프로젝트의 **Storage** 탭으로 이동합니다.
    - **Vercel Postgres**를 **생성**하고, **Connect** 버튼을 눌러 새 프로젝트에 연결합니다.
    - **Vercel Blob**을 **생성**하고, **Connect** 버튼을 눌러 새 프로젝트에 연결합니다.
    - 이제, 로컬 터미널에서 `vercel link`를 실행하여 로컬 폴더를 방금 Vercel에서 생성한 새 프로젝트와 연결합니다.

    ```bash
    vercel link
    ```

    (CLI가 물어보는 질문에 따라 방금 생성한 새 프로젝트를 선택합니다.)

5.  **환경 변수 가져오기**
    Vercel 프로젝트에 연결된 환경 변수(DB, Blob 비밀 키)들을 로컬로 가져옵니다.

    ```bash
    vercel env pull .env.development.local
    ```

    이 명령을 실행하면 `POSTGRES_URL`과 `BLOB_READ_WRITE_TOKEN`이 포함된 `.env.development.local` 파일이 자동으로 생성됩니다.

    ‼️프로젝트를 위한 추가 안내 사항 ‼️
    해당 프로젝트는 개인 계정 Vercel을 사용하여... 직접 인증은 어려울 것 같아서, 요청 주시면 env 파일 공유하는 쪽으로 하겠습니다!

    가능하다면 코드는 참조만 하고 배포 화면에서 테스트해주시면 좋을 것 같습니다🥲

    어려울 경우에는 그 사이에 서버 배포 연결 없는 코드로 수정해보도록 하겠습니다!

6.  **개발 서버 실행**

    ```bash
    npm run dev
    ```

7.  **데이터베이스 테이블 초기화 (필수!)**
    서버가 실행된 상태에서, 웹 브라우저를 열어 **아래 주소로 딱 한 번 접속**합니다. 이 작업은 Vercel Postgres DB에 필요한 테이블(users, posts 등)을 생성합니다.

    ```
    http://localhost:3000/api/init
    ```

    브라우저에 `{"message":"Database initialized successfully"}`가 보이면 성공입니다.

8.  **실행 완료**
    이제 `http://localhost:3000`로 접속하여 회원가입 및 로그인을 테스트할 수 있습니다.

---

### ⚠️ 중요: 환경 변수

`vercel env pull`로 생성된 `.env.development.local` 파일은 **본인의 비밀 키**입니다. **절대로 이 파일을 다른 사람에게 공유하거나 Git에 푸시하지 마세요.**
