pipeline {
    agent any

    environment {
        DOCKERHUB_REPO = 'rv2342/nodejs-devops-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        stage('Node 16 CI') {
            agent {
                docker {
                    image 'node:16'
                    reuseNode true
                }
            }

            stages {

                stage('Verify Build Environment') {
                    steps {
                        sh '''
                            echo "Node version:"
                            node --version
                            echo "NPM version:"
                            npm --version
                        '''
                    }
                }

                stage('Install Dependencies') {
                    steps {
                        sh 'npm ci'
                    }
                }

                stage('Unit Tests') {
                    steps {
                        sh 'npm test'
                    }
                }

                stage('Dependency Vulnerability Scan') {
                    steps {
                        echo 'Checking dependencies for High or Critical vulnerabilities...'
                        sh 'npm audit --audit-level=high'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                        -t ${DOCKERHUB_REPO}:${IMAGE_TAG} \
                        -t ${DOCKERHUB_REPO}:latest \
                        .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | \
                            docker login \
                            -u "$DOCKERHUB_USER" \
                            --password-stdin

                        docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}
                        docker push ${DOCKERHUB_REPO}:latest

                        docker logout
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully."
            echo "Published image: ${DOCKERHUB_REPO}:${IMAGE_TAG}"
        }

        failure {
            echo "Pipeline failed. Check the failed stage for details."
        }

        always {
            sh 'docker logout 2>/dev/null || true'
        }
    }
}
