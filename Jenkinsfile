#!groovy

def branch = "PROD-595"
echo "Current branch is ${branch}"

def base_branch = "master"
String cron_string = branch == base_branch ? """TZ=EST H 22 * * *""" : ""
def now = new Date().format("yyyyMMdd-HHmmss", TimeZone.getTimeZone('UTC-4'))

def docker_tag = ""
if (branch == "master") {
    docker_tag = branch
} else {
    docker_tag = branch + "-" + now
}
Calendar cal=Calendar.getInstance();
def hour = cal.get(Calendar.HOUR_OF_DAY)

// Configure the context/namespace to use
/*switch(branch){
  case "PROD-595" :
    namespace = "cerebri-science-qa";
    k8s_node = 'sbk8sjump2';
    break;
  case "qa":
    namespace = "cerebri-science-qa";
    k8s_node = 'sbk8sjump2';
    break;
  case "stage":
    namespace = "cerebri-science-stage";
    k8s_node = 'sbk8sjump2';
    break;
  default:
    namespace = "cerebri-science-jenkins";
    k8s_node = 'sbk8sjump2';
    break;
} */

pipeline {
  agent none
  triggers { cron(cron_string) }
  stages {
    stage('Jenkins Checkout') {
      agent {
        label 'linux' && 'ubuntu' && 'x64'
      }
      steps {
        script {
          // Let BitBucket know we've started the build
          bitbucketStatusNotify(buildState: 'INPROGRESS')
          checkout scm
        }
      }
    }

    stage('NPM Install') {
      agent {
        label 'linux' && 'ubuntu' && 'x64'
      }
      steps {
        sh "npm install"
      }
    }
    

    stage('Build') {
      agent {
        label 'linux' && 'ubuntu' && 'x64'
      }
      steps {
        script {
          try {
            sh "ng build --prod"
          } catch (Exception e) {        

            error("Angular build failed")
          }
        }
      }
    }  
  }
    
}
