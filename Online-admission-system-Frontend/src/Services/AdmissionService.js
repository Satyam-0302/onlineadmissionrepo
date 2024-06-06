import axios from "axios";
 
export const admissionById=(applicationId)=>{
    return axios.get('http://localhost:8080/api/admission/application/'+applicationId);
}
export const getAllAdmission=()=>{
    return axios.get('http://localhost:8080/api/admission');
}
export const getAllColleges=()=>{
    return axios.get('http://localhost:8080/api/colleges');
}
 
export const deleteAdmission=(applicationId)=>{
    return axios.delete('http://localhost:8080/api/admission/'+applicationId);
}