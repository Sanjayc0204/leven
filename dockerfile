# Setting the Base Image
FROM node:20.13.1-alpine

ENV GOOGLE_CLIENT_ID=539750439687-fqbcl1n2tho5s362loafhqas2bkkknrk.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV MONGODB_URI=mongodb+srv://Condyte:CondyteMongo123!@clustercondyte.fsqdl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCondyte
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_URL_INTERNAL=http://localhost:3000
ENV NEXTAUTH_SECRET=7r4+1+ofOit9HuSTHVps2TerJEiAHZJr925rqqDJ0hg=

# Creating the Working Directory
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all files in dir
COPY . .

RUN npm run build

# Runtime stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx.conf that reads PORT environment variable from cloud run - google assigns random ports, so we need this
RUN printf 'server {\n\
    listen $PORT;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf.template

# Use shell to substitute PORT value in nginx.conf
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

