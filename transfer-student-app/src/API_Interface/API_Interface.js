import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://localhost:8443/api/v1`;
    axios.defaults.baseURL = `http://localhost:8443/api/v1`;


    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true;


//    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return axios;
};


const axiosAgent = AxiosConfigured();

export default class APIInterface {

    async getUserInfo(user_id) {
        return axiosAgent.get(`login/${user_id}`)
            .then(userInfo => userInfo.data)
            .catch(error => (
                {
                    error,
                    user: undefined
                 }));
    }

    async getAdvisorInfo(user_id) {
        return axiosAgent.get(`advisor-login/${user_id}`)
            .then(userInfo => userInfo.data)
            .catch(error => (
                {
                    error,
                    user: undefined
                }));
    }


    async transferCourses(studentID) {
        return axiosAgent.get(`transfer/${studentID}/transfer-courses`);
    }

    async enrollment(studentID) {
        return axiosAgent.get(`transfer/${studentID}/enrollment`);
    }

    async testCreditCourses(studentID) {
        return axiosAgent.get(`transfer/${studentID}/test-credit-courses`);
    }

    async arrUpdateForm(studentID) {
        return axiosAgent.get(`transfer/${studentID}/arr-update-form`);
    }

    async nonarticulatedCourses(studentID) {
        return axiosAgent.get(`transfer/${studentID}/nonarticulated-courses`);
    }

    async majorCourses(studentID, subject) {
        return axiosAgent.get(`transfer/${studentID}/${subject}/major-articulated-courses`);
    }

    //Temporary Route for Corresponding Courses
    async csCourseCatalog(subject) {
        return axiosAgent.get(`courses/cs/course-catalog`);
    }

    async csCourseCatalogAll(subject) {
        return axiosAgent.get(`courses/cs/course-catalog-all`);
    }

    async courseCatalogBySubject(subject) {
        return axiosAgent.get(`courses/${subject}/course-catalog`);
    }

    async insertCurrentCourses(courseDictionary){
        return axiosAgent.post(`transfer/insert-current-course`, courseDictionary);
    }
    async insertAdditionalCourses(courseDictionary){
        return axiosAgent.post(`transfer/insert-additional-course`, courseDictionary);
    }

    async uploadSyllabus(data, dictionary){
        return axiosAgent.post(`/upload`, data, dictionary);
    }

    async updateStudentCourses(courseDictionary){
        return axiosAgent.post(`transfer/update-student-course`, courseDictionary);
    }

    async newTransferStudents(advisorID) {
        return axiosAgent.get(`advisor-students/${advisorID}/new-transfer-students`);
    }

    async studentEmailInfo(studentID) {
        return axiosAgent.get(`advisor-students/${studentID}/student-email-info`);
    }

    async sendEmail(data) {
        return axiosAgent.post(`email/send-email`, data);
    }

    async insertNewCase(caseDictionary){
        return axiosAgent.post(`student-cases/add-case`, caseDictionary);
    }
    async getActiveCases(advisorID){
        return axiosAgent.get(`student-cases/${advisorID}/active-cases`);
    }

    async generateToken(studentDictionary){
        return axiosAgent.post(`login/generate-token`, studentDictionary);
    }

    async getStudentToken(studentID){
        return axiosAgent.get(`login/${studentID}/get-student-token`);
    }

    async getCurrentCourses(studentID){
        return axiosAgent.get(`transfer/${studentID}/get-current-courses`);

    }

    async getSessionCourses(studentID){
        return axiosAgent.get(`transfer/${studentID}/get-session-courses`);

    }

    async getEligible(studentID) {
        return axiosAgent.get(`transfer/${studentID}/eligible`);
    }

    async getEligibleSaved(studentID) {
        return axiosAgent.get(`transfer/${studentID}/eligible-saved`);
    }

    async saveEligibleCourses(courseDictionary){
        return axiosAgent.post(`transfer/save-eligible-courses`, courseDictionary);
    }

    async clearEligible(studentID) {
        return axiosAgent.get(`transfer/${studentID}/clear-eligible`);
    }

    async studentSessionCourses(courseDictionary){
        return axiosAgent.post(`transfer/student-session-courses`, courseDictionary);
    }

    async getAdditionalCourses(studentID){
        return axiosAgent.get(`transfer/${studentID}/get-additional-courses`);
    }

    async getMatchedCourses(studentID){
        return axiosAgent.get(`transfer/${studentID}/matched-courses`);

    }

    async getStudentInfo(studentID){
        return axiosAgent.get(`advisor-students/${studentID}/get-student-info`);

    }

    async getStudentCase(studentID){
        return axiosAgent.get(`/student-cases/${studentID}/case-by-student-id`)
    }

    async getSyllabusPDF(courseKey){
        return axiosAgent.get(`/download/${courseKey}/get-syllabus`);
    }

    async insertSyllabusURL(urlDictionary){
        return axiosAgent.post(`/syllabus/insert-syllabus-url`, urlDictionary);
    }

    async getSyllabusURL(courseKey){
        return axiosAgent.get(`/syllabus/${courseKey}/get-syllabus-url`);
    }

}
