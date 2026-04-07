# 사용할 Node.js 버전을 지정합니다. LTS 버전인 20을 사용합니다.
FROM node:20-alpine AS builder

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 패키지 파일들을 먼저 복사하여 종속성을 설치합니다.
COPY package*.json ./

# 프로덕션 의존성과 개발 의존성 모두를 설치합니다. (빌드를 위해 필요)
RUN npm install

# 애플리케이션 소스 코드를 모두 복사합니다.
COPY . .

# 프론트엔드를 빌드합니다 (Vite build 실행하여 dist 폴더 생성).
RUN npm run build

# 실제 프로덕션에서 실행될 이미지를 준비합니다.
FROM node:20-alpine AS runner

WORKDIR /app

# 프로덕션에서는 개발 의존성이 필요 없으므로 package.json만 먼저 복사합니다.
COPY package*.json ./

# 프로덕션 의존성만 설치합니다. (용량 최적화)
RUN npm install --production

# 빌드된 프론트엔드 에셋(dist 폴더)과 백엔드 서버 파일 등을 가져옵니다.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/node_modules ./node_modules
# tsx가 프로젝트에 로컬로 깔려 실행되므로 관련 파일들을 다 넘겨야 안전합니다.

# 프로젝트 실행 환경 변수를 프로덕션으로 고정합니다.
ENV NODE_ENV=production
# Google Cloud Run은 PORT 환경변수를 자동으로 8080으로 넘겨주지만, 서버가 3000번을 쓰므로 환경 변수로 열어줍니다.
# 다만 server.ts에 하드코딩된 PORT=3000 변수 대신 process.env.PORT || 3000을 사용해야 제대로 매핑됩니다. (코드 수정 필요)
# 이번엔 컨테이너 내부 3000 포트를 노출합니다.
EXPOSE 3000

# 서버를 실행합니다.
CMD ["npm", "start"]
