// Professional Resume Builder JavaScript

class ResumeBuilder {
    constructor() {
        this.currentTemplate = 'modern';
        this.currentSection = 'personal';
        this.zoomLevel = 100;
        this.resumeData = {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                address: '',
                linkedin: '',
                portfolio: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            certifications: []
        };
        
        this.experienceCounter = 0;
        this.educationCounter = 0;
        this.skillCounter = 0;
        this.certificationCounter = 0;
        
        this.init();
    }

    init() {
        this.loadSavedData();
        this.setupEventListeners();
        this.addDefaultItems();
        this.updatePreview();
        this.updateProgress();
        this.showWelcomeModal();
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('resumeBuilderData');
            const savedTemplate = localStorage.getItem('resumeBuilderTemplate');
            
            if (savedData) {
                this.resumeData = JSON.parse(savedData);
                this.populateFormData();
            } else {
                this.loadSampleData();
            }
            
            if (savedTemplate) {
                this.currentTemplate = savedTemplate;
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            this.loadSampleData();
        }
    }

    loadSampleData() {
        const sampleData = {
            personalInfo: {
                fullName: "Sarah Johnson",
                email: "sarah.johnson@email.com",
                phone: "+1 (555) 123-4567",
                address: "New York, NY",
                linkedin: "linkedin.com/in/sarahjohnson",
                portfolio: "sarahjohnson.dev"
            },
            summary: "Results-driven marketing professional with 8+ years of experience in digital marketing, brand management, and customer acquisition. Proven track record of increasing brand awareness by 150% and driving revenue growth of $2M+ annually.",
            experience: [
                {
                    title: "Senior Marketing Manager",
                    company: "TechCorp Inc.",
                    location: "New York, NY",
                    startDate: "2020-03",
                    endDate: "",
                    current: true,
                    description: "• Led cross-functional team of 12 marketing professionals\n• Increased brand awareness by 150% through integrated campaigns\n• Managed $500K annual marketing budget with 20% YoY growth"
                }
            ],
            education: [
                {
                    degree: "Master of Business Administration",
                    school: "Harvard Business School",
                    location: "Cambridge, MA",
                    graduationYear: "2018",
                    gpa: "3.8"
                }
            ],
            skills: [
                { name: "Digital Marketing", level: 90 },
                { name: "Google Analytics", level: 85 },
                { name: "SEO/SEM", level: 80 }
            ],
            certifications: [
                {
                    name: "Google Analytics Certified",
                    issuer: "Google",
                    year: "2023"
                }
            ]
        };

        this.resumeData = sampleData;
        this.populateFormData();
    }

    addDefaultItems() {
        if (this.resumeData.experience.length === 0) {
            this.addExperience();
        }
        if (this.resumeData.education.length === 0) {
            this.addEducation();
        }
        if (this.resumeData.skills.length === 0) {
            this.addSkill();
        }
        if (this.resumeData.certifications.length === 0) {
            this.addCertification();
        }
    }

    populateFormData() {
        // Personal Info
        Object.keys(this.resumeData.personalInfo).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.resumeData.personalInfo[key];
            }
        });

        // Summary
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
            summaryElement.value = this.resumeData.summary;
            this.updateCharacterCount();
        }

        // Populate dynamic sections
        this.populateExperience();
        this.populateEducation();
        this.populateSkills();
        this.populateCertifications();
    }

    populateExperience() {
        const container = document.getElementById('experienceList');
        if (!container) return;
        
        container.innerHTML = '';
        this.experienceCounter = 0;
        
        this.resumeData.experience.forEach((exp) => {
            const expElement = this.createExperienceItem();
            container.appendChild(expElement);
            
            expElement.querySelector('.job-title').value = exp.title;
            expElement.querySelector('.company').value = exp.company;
            expElement.querySelector('.location').value = exp.location;
            expElement.querySelector('.start-date').value = exp.startDate;
            expElement.querySelector('.end-date').value = exp.endDate;
            expElement.querySelector('.current-job').checked = exp.current;
            expElement.querySelector('.job-description').value = exp.description;
            
            if (exp.current) {
                expElement.querySelector('.end-date').disabled = true;
            }
        });
    }

    populateEducation() {
        const container = document.getElementById('educationList');
        if (!container) return;
        
        container.innerHTML = '';
        this.educationCounter = 0;
        
        this.resumeData.education.forEach((edu) => {
            const eduElement = this.createEducationItem();
            container.appendChild(eduElement);
            
            eduElement.querySelector('.degree').value = edu.degree;
            eduElement.querySelector('.school').value = edu.school;
            eduElement.querySelector('.edu-location').value = edu.location;
            eduElement.querySelector('.graduation-year').value = edu.graduationYear;
            eduElement.querySelector('.gpa').value = edu.gpa;
        });
    }

    populateSkills() {
        const container = document.getElementById('skillsList');
        if (!container) return;
        
        container.innerHTML = '';
        this.skillCounter = 0;
        
        this.resumeData.skills.forEach((skill) => {
            const skillElement = this.createSkillItem();
            container.appendChild(skillElement);
            
            skillElement.querySelector('.skill-name').value = skill.name;
            skillElement.querySelector('.skill-range').value = skill.level;
            skillElement.querySelector('.skill-value').textContent = skill.level + '%';
        });
    }

    populateCertifications() {
        const container = document.getElementById('certificationsList');
        if (!container) return;
        
        container.innerHTML = '';
        this.certificationCounter = 0;
        
        this.resumeData.certifications.forEach((cert) => {
            const certElement = this.createCertificationItem();
            container.appendChild(certElement);
            
            certElement.querySelector('.cert-name').value = cert.name;
            certElement.querySelector('.cert-issuer').value = cert.issuer;
            certElement.querySelector('.cert-year').value = cert.year;
        });
    }

    setupEventListeners() {
        // Welcome Modal
        document.getElementById('startBuilding').addEventListener('click', () => {
            // Get selected template from welcome modal before closing
            const activeCard = document.querySelector('#welcomeModal .template-card.active');
            if (activeCard) {
                this.currentTemplate = activeCard.dataset.template;
                this.updatePreview(); // Update preview with selected template
            }
            this.hideWelcomeModal();
        });
        
        document.getElementById('skipWelcome').addEventListener('click', () => {
            this.hideWelcomeModal();
        });

        document.getElementById('closeWelcomeModal').addEventListener('click', () => {
            this.hideWelcomeModal();
        });

        // Template selection in welcome modal
        document.querySelectorAll('#welcomeModal .template-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#welcomeModal .template-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.currentTemplate = card.dataset.template;
                // Don't update preview here, wait for user to click "Get Started"
            });
        });

        // Modal outside click and ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal:not(.hidden)');
                modals.forEach(modal => modal.classList.add('hidden'));
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });

        // Header actions
        document.getElementById('templateBtn').addEventListener('click', () => {
            this.showTemplateModal();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveData();
        });
        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadResume();
        });

        // Template Modal
        document.getElementById('closeTemplateModal').addEventListener('click', () => {
            this.hideTemplateModal();
        });
        
        document.getElementById('cancelTemplate').addEventListener('click', () => {
            this.hideTemplateModal();
        });
        
        document.getElementById('applyTemplate').addEventListener('click', () => {
            this.applySelectedTemplate();
        });

        // Template selection in template modal
        document.querySelectorAll('#templateModal .template-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('#templateModal .template-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = btn.dataset.section;
                this.switchSection(sectionName);
            });
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoomLevel = Math.min(150, this.zoomLevel + 10);
            this.updateZoom();
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoomLevel = Math.max(50, this.zoomLevel - 10);
            this.updateZoom();
        });

        // Form inputs - Personal Info
        Object.keys(this.resumeData.personalInfo).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.resumeData.personalInfo[key] = e.target.value;
                    this.updatePreview();
                    this.updateProgress();
                    this.autoSave();
                });
            }
        });

        // Summary
        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
            summaryElement.addEventListener('input', (e) => {
                this.resumeData.summary = e.target.value;
                this.updateCharacterCount();
                this.updatePreview();
                this.updateProgress();
                this.autoSave();
            });
        }

        // Add buttons
        document.getElementById('addExperience').addEventListener('click', () => {
            this.addExperience();
        });
        
        document.getElementById('addEducation').addEventListener('click', () => {
            this.addEducation();
        });
        
        document.getElementById('addSkill').addEventListener('click', () => {
            this.addSkill();
        });
        
        document.getElementById('addCertification').addEventListener('click', () => {
            this.addCertification();
        });

        // Auto-save every 10 seconds
        setInterval(() => {
            this.autoSave();
        }, 10000);
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        modal.classList.remove('hidden');
        
        // Set current template as active
        document.querySelectorAll('#welcomeModal .template-card').forEach(card => {
            card.classList.toggle('active', card.dataset.template === this.currentTemplate);
        });
    }

    hideWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        modal.classList.add('hidden');
    }

    showTemplateModal() {
        const modal = document.getElementById('templateModal');
        modal.classList.remove('hidden');
        
        // Set current template as active
        document.querySelectorAll('#templateModal .template-option').forEach(option => {
            option.classList.toggle('active', option.dataset.template === this.currentTemplate);
        });
    }

    hideTemplateModal() {
        const modal = document.getElementById('templateModal');
        modal.classList.add('hidden');
    }

    applySelectedTemplate() {
        const activeOption = document.querySelector('#templateModal .template-option.active');
        if (activeOption) {
            const newTemplate = activeOption.dataset.template;
            if (newTemplate !== this.currentTemplate) {
                this.currentTemplate = newTemplate;
                this.updatePreview(); // Force immediate preview update
                localStorage.setItem('resumeBuilderTemplate', this.currentTemplate);
                this.showNotification(`${this.getTemplateName(newTemplate)} template applied successfully!`, 'success');
            }
            this.hideTemplateModal();
        }
    }

    getTemplateName(templateId) {
        const names = {
            'modern': 'Modern',
            'executive': 'Executive',
            'creative': 'Creative',
            'technical': 'Technical'
        };
        return names[templateId] || 'Template';
    }

    switchSection(sectionName) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionName) {
                btn.classList.add('active');
            }
        });

        // Hide all sections
        document.querySelectorAll('.form-section-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    }

    updateCharacterCount() {
        const summary = document.getElementById('summary');
        const counter = document.getElementById('summaryCount');
        if (summary && counter) {
            counter.textContent = summary.value.length;
            counter.parentElement.style.color = summary.value.length > 500 ? 'var(--color-error)' : 'var(--color-text-secondary)';
        }
    }

    updateZoom() {
        const preview = document.getElementById('resumePreview');
        const zoomDisplay = document.getElementById('zoomLevel');
        
        preview.style.transform = `scale(${this.zoomLevel / 100})`;
        zoomDisplay.textContent = `${this.zoomLevel}%`;
    }

    updateProgress() {
        let completedFields = 0;
        let totalFields = 0;

        // Personal Info (3 required fields)
        const personalRequired = ['fullName', 'email', 'phone'];
        personalRequired.forEach(field => {
            totalFields++;
            if (this.resumeData.personalInfo[field]?.trim()) {
                completedFields++;
            }
        });

        // Summary
        totalFields++;
        if (this.resumeData.summary?.trim()) {
            completedFields++;
        }

        // Experience (at least 1)
        totalFields++;
        if (this.resumeData.experience.length > 0 && this.resumeData.experience.some(exp => exp.title && exp.company)) {
            completedFields++;
        }

        // Education (at least 1)
        totalFields++;
        if (this.resumeData.education.length > 0 && this.resumeData.education.some(edu => edu.degree && edu.school)) {
            completedFields++;
        }

        // Skills (at least 3)
        totalFields++;
        if (this.resumeData.skills.length >= 3 && this.resumeData.skills.filter(skill => skill.name).length >= 3) {
            completedFields++;
        }

        const percentage = Math.round((completedFields / totalFields) * 100);
        
        document.getElementById('progressPercent').textContent = percentage;
        document.getElementById('progressFill').style.width = `${percentage}%`;

        this.updateATSScore();
    }

    updateATSScore() {
        let score = 0;
        
        // Basic info complete (+25)
        if (this.resumeData.personalInfo.fullName && this.resumeData.personalInfo.email && this.resumeData.personalInfo.phone) {
            score += 25;
        }
        
        // Professional summary (+20)
        if (this.resumeData.summary && this.resumeData.summary.length >= 50) {
            score += 20;
        }
        
        // Experience (+30)
        if (this.resumeData.experience.length > 0 && this.resumeData.experience.some(exp => exp.title && exp.company)) {
            score += 30;
        }
        
        // Education (+15)
        if (this.resumeData.education.length > 0 && this.resumeData.education.some(edu => edu.degree && edu.school)) {
            score += 15;
        }
        
        // Skills (+10)
        if (this.resumeData.skills.length >= 3 && this.resumeData.skills.filter(skill => skill.name).length >= 3) {
            score += 10;
        }
        
        document.getElementById('atsScore').textContent = score;
        
        const scoreElement = document.getElementById('atsScore');
        if (score >= 80) {
            scoreElement.style.color = 'var(--color-success)';
        } else if (score >= 60) {
            scoreElement.style.color = 'var(--color-warning)';
        } else {
            scoreElement.style.color = 'var(--color-error)';
        }
    }

    addExperience() {
        const newExp = {
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        
        const index = this.resumeData.experience.length;
        this.resumeData.experience.push(newExp);
        
        const container = document.getElementById('experienceList');
        const expElement = this.createExperienceItem();
        container.appendChild(expElement);
        
        this.updatePreview();
        this.updateProgress();
    }

    createExperienceItem() {
        const index = this.experienceCounter++;
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>Position ${index + 1}</h4>
                <button class="btn btn--sm btn--outline remove-btn" type="button">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Job Title *</label>
                    <input type="text" class="form-control job-title" placeholder="Senior Marketing Manager" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Company *</label>
                    <input type="text" class="form-control company" placeholder="Company Name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control location" placeholder="New York, NY">
                </div>
                <div class="form-group">
                    <label class="form-label">Start Date *</label>
                    <input type="month" class="form-control start-date" required>
                </div>
                <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="month" class="form-control end-date">
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" class="current-job"> Currently work here
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Job Description *</label>
                <textarea class="form-control job-description" rows="4" placeholder="• Led cross-functional team of 12 marketing professionals&#10;• Increased brand awareness by 150% through integrated campaigns&#10;• Managed $500K annual marketing budget with 20% YoY growth" required></textarea>
            </div>
        `;

        this.setupExperienceListeners(div);
        return div;
    }

    setupExperienceListeners(element) {
        const getExperienceIndex = () => {
            return Array.from(element.parentNode.children).indexOf(element);
        };

        // Remove button
        element.querySelector('.remove-btn').addEventListener('click', () => {
            const index = getExperienceIndex();
            element.remove();
            this.resumeData.experience.splice(index, 1);
            this.updatePreview();
            this.updateProgress();
        });

        // Form inputs
        element.querySelector('.job-title').addEventListener('input', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].title = e.target.value;
                this.updatePreview();
                this.updateProgress();
            }
        });

        element.querySelector('.company').addEventListener('input', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].company = e.target.value;
                this.updatePreview();
                this.updateProgress();
            }
        });

        element.querySelector('.location').addEventListener('input', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].location = e.target.value;
                this.updatePreview();
            }
        });

        element.querySelector('.start-date').addEventListener('input', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].startDate = e.target.value;
                this.updatePreview();
            }
        });

        element.querySelector('.end-date').addEventListener('input', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].endDate = e.target.value;
                this.updatePreview();
            }
        });

        element.querySelector('.current-job').addEventListener('change', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].current = e.target.checked;
                const endDateInput = element.querySelector('.end-date');
                endDateInput.disabled = e.target.checked;
                if (e.target.checked) {
                    endDateInput.value = '';
                    this.resumeData.experience[index].endDate = '';
                }
                this.updatePreview();
            }
        });

        element.querySelector('.job-description').addEventListener('input', (e) => {
            const index = getExperienceIndex();
            if (this.resumeData.experience[index]) {
                this.resumeData.experience[index].description = e.target.value;
                this.updatePreview();
            }
        });
    }

    addEducation() {
        const newEdu = {
            degree: '',
            school: '',
            location: '',
            graduationYear: '',
            gpa: ''
        };
        
        const index = this.resumeData.education.length;
        this.resumeData.education.push(newEdu);
        
        const container = document.getElementById('educationList');
        const eduElement = this.createEducationItem();
        container.appendChild(eduElement);
        
        this.updatePreview();
        this.updateProgress();
    }

    createEducationItem() {
        const index = this.educationCounter++;
        const div = document.createElement('div');
        div.className = 'education-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>Education ${index + 1}</h4>
                <button class="btn btn--sm btn--outline remove-btn" type="button">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Degree *</label>
                    <input type="text" class="form-control degree" placeholder="Bachelor of Science in Computer Science" required>
                </div>
                <div class="form-group">
                    <label class="form-label">School *</label>
                    <input type="text" class="form-control school" placeholder="University Name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control edu-location" placeholder="City, State">
                </div>
                <div class="form-group">
                    <label class="form-label">Graduation Year</label>
                    <input type="number" class="form-control graduation-year" placeholder="2023" min="1950" max="2030">
                </div>
                <div class="form-group">
                    <label class="form-label">GPA (optional)</label>
                    <input type="text" class="form-control gpa" placeholder="3.8">
                </div>
            </div>
        `;

        this.setupEducationListeners(div);
        return div;
    }

    setupEducationListeners(element) {
        const getEducationIndex = () => {
            return Array.from(element.parentNode.children).indexOf(element);
        };

        // Remove button
        element.querySelector('.remove-btn').addEventListener('click', () => {
            const index = getEducationIndex();
            element.remove();
            this.resumeData.education.splice(index, 1);
            this.updatePreview();
            this.updateProgress();
        });

        // Form inputs
        ['degree', 'school', 'edu-location', 'graduation-year', 'gpa'].forEach(field => {
            const input = element.querySelector(`.${field}`);
            if (input) {
                input.addEventListener('input', (e) => {
                    const index = getEducationIndex();
                    const key = field === 'edu-location' ? 'location' : field.replace('-', '');
                    if (this.resumeData.education[index]) {
                        this.resumeData.education[index][key] = e.target.value;
                        this.updatePreview();
                        this.updateProgress();
                    }
                });
            }
        });
    }

    addSkill() {
        const newSkill = {
            name: '',
            level: 80
        };
        
        const index = this.resumeData.skills.length;
        this.resumeData.skills.push(newSkill);
        
        const container = document.getElementById('skillsList');
        const skillElement = this.createSkillItem();
        container.appendChild(skillElement);
        
        this.updatePreview();
        this.updateProgress();
    }

    createSkillItem() {
        const div = document.createElement('div');
        div.className = 'skill-item';
        div.innerHTML = `
            <div class="form-group">
                <label class="form-label">Skill Name</label>
                <input type="text" class="form-control skill-name" placeholder="JavaScript">
            </div>
            <div class="form-group">
                <label class="form-label">Proficiency Level (%)</label>
                <input type="range" class="skill-range" min="0" max="100" value="80">
                <span class="skill-value">80%</span>
            </div>
            <button class="btn btn--sm btn--outline remove-skill-btn" type="button">Remove</button>
        `;

        this.setupSkillListeners(div);
        return div;
    }

    setupSkillListeners(element) {
        const getSkillIndex = () => {
            return Array.from(element.parentNode.children).indexOf(element);
        };

        // Remove button
        element.querySelector('.remove-skill-btn').addEventListener('click', () => {
            const index = getSkillIndex();
            element.remove();
            this.resumeData.skills.splice(index, 1);
            this.updatePreview();
            this.updateProgress();
        });

        // Skill name
        element.querySelector('.skill-name').addEventListener('input', (e) => {
            const index = getSkillIndex();
            if (this.resumeData.skills[index]) {
                this.resumeData.skills[index].name = e.target.value;
                this.updatePreview();
                this.updateProgress();
            }
        });

        // Skill level
        const rangeInput = element.querySelector('.skill-range');
        const valueDisplay = element.querySelector('.skill-value');
        
        rangeInput.addEventListener('input', (e) => {
            const index = getSkillIndex();
            const value = e.target.value;
            if (this.resumeData.skills[index]) {
                this.resumeData.skills[index].level = parseInt(value);
                valueDisplay.textContent = `${value}%`;
                this.updatePreview();
            }
        });
    }

    addCertification() {
        const newCert = {
            name: '',
            issuer: '',
            year: ''
        };
        
        const index = this.resumeData.certifications.length;
        this.resumeData.certifications.push(newCert);
        
        const container = document.getElementById('certificationsList');
        const certElement = this.createCertificationItem();
        container.appendChild(certElement);
        
        this.updatePreview();
        this.updateProgress();
    }

    createCertificationItem() {
        const index = this.certificationCounter++;
        const div = document.createElement('div');
        div.className = 'certification-item';
        div.innerHTML = `
            <div class="item-header">
                <h4>Certification ${index + 1}</h4>
                <button class="btn btn--sm btn--outline remove-btn" type="button">Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Certification Name *</label>
                    <input type="text" class="form-control cert-name" placeholder="Google Analytics Certified" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Issuing Organization *</label>
                    <input type="text" class="form-control cert-issuer" placeholder="Google" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Year Obtained</label>
                    <input type="number" class="form-control cert-year" placeholder="2023" min="1950" max="2030">
                </div>
            </div>
        `;

        this.setupCertificationListeners(div);
        return div;
    }

    setupCertificationListeners(element) {
        const getCertificationIndex = () => {
            return Array.from(element.parentNode.children).indexOf(element);
        };

        // Remove button
        element.querySelector('.remove-btn').addEventListener('click', () => {
            const index = getCertificationIndex();
            element.remove();
            this.resumeData.certifications.splice(index, 1);
            this.updatePreview();
            this.updateProgress();
        });

        // Form inputs
        element.querySelector('.cert-name').addEventListener('input', (e) => {
            const index = getCertificationIndex();
            if (this.resumeData.certifications[index]) {
                this.resumeData.certifications[index].name = e.target.value;
                this.updatePreview();
                this.updateProgress();
            }
        });

        element.querySelector('.cert-issuer').addEventListener('input', (e) => {
            const index = getCertificationIndex();
            if (this.resumeData.certifications[index]) {
                this.resumeData.certifications[index].issuer = e.target.value;
                this.updatePreview();
            }
        });

        element.querySelector('.cert-year').addEventListener('input', (e) => {
            const index = getCertificationIndex();
            if (this.resumeData.certifications[index]) {
                this.resumeData.certifications[index].year = e.target.value;
                this.updatePreview();
            }
        });
    }

    updatePreview() {
        const preview = document.getElementById('resumePreview');
        if (!preview) return;
        
        // Clear existing classes and set new template class
        preview.className = `resume-preview ${this.currentTemplate}`;
        
        switch (this.currentTemplate) {
            case 'modern':
                this.renderModernTemplate(preview);
                break;
            case 'executive':
                this.renderExecutiveTemplate(preview);
                break;
            case 'technical':
                this.renderTechnicalTemplate(preview);
                break;
            case 'creative':
                this.renderCreativeTemplate(preview);
                break;
            default:
                this.renderModernTemplate(preview);
        }
    }

    renderModernTemplate(container) {
        const { personalInfo, summary, experience, education, skills, certifications } = this.resumeData;
        
        container.innerHTML = `
            <div class="resume-sidebar">
                <div class="resume-header">
                    <h1>${personalInfo.fullName || 'Your Name'}</h1>
                    <div class="contact-info">
                        ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
                        ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
                        ${personalInfo.address ? `<div>${personalInfo.address}</div>` : ''}
                        ${personalInfo.linkedin ? `<div>${personalInfo.linkedin}</div>` : ''}
                        ${personalInfo.portfolio ? `<div>${personalInfo.portfolio}</div>` : ''}
                    </div>
                </div>
                
                ${skills.filter(s => s.name).length > 0 ? `
                <div class="resume-section">
                    <h2>Skills</h2>
                    ${skills.filter(s => s.name).map(skill => `
                        <div class="skill-bar">
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-progress">
                                <div class="skill-progress-fill" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${education.filter(e => e.degree || e.school).length > 0 ? `
                <div class="resume-section">
                    <h2>Education</h2>
                    ${education.filter(e => e.degree || e.school).map(edu => `
                        <div class="education-item-preview">
                            <div class="job-title">${edu.degree || 'Degree'}</div>
                            <div class="company-info">${edu.school || 'School'}${edu.location ? ` • ${edu.location}` : ''}</div>
                            ${edu.graduationYear ? `<div class="company-info">${edu.graduationYear}</div>` : ''}
                            ${edu.gpa ? `<div class="company-info">GPA: ${edu.gpa}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${certifications.filter(c => c.name).length > 0 ? `
                <div class="resume-section">
                    <h2>Certifications</h2>
                    ${certifications.filter(c => c.name).map(cert => `
                        <div class="cert-item-preview">
                            <div class="skill-name">${cert.name}</div>
                            <div class="company-info">${cert.issuer || 'Organization'}${cert.year ? ` • ${cert.year}` : ''}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            
            <div class="resume-main">
                ${summary ? `
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${summary}</p>
                </div>
                ` : ''}
                
                ${experience.filter(e => e.title || e.company).length > 0 ? `
                <div class="resume-section">
                    <h2>Professional Experience</h2>
                    ${experience.filter(e => e.title || e.company).map(exp => `
                        <div class="experience-item-preview">
                            <div class="job-title">${exp.title || 'Job Title'}</div>
                            <div class="company-info">${exp.company || 'Company'}${exp.location ? ` • ${exp.location}` : ''}</div>
                            <div class="company-info">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</div>
                            ${exp.description ? `<div class="job-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }

    renderExecutiveTemplate(container) {
        const { personalInfo, summary, experience, education, skills, certifications } = this.resumeData;
        
        container.innerHTML = `
            <div class="resume-header">
                <h1>${personalInfo.fullName || 'Your Name'}</h1>
                <div class="contact-info" style="text-align: center; color: #666; margin-top: 10px;">
                    ${personalInfo.email ? `${personalInfo.email}` : ''}
                    ${personalInfo.phone ? ` • ${personalInfo.phone}` : ''}
                    ${personalInfo.address ? ` • ${personalInfo.address}` : ''}
                    ${personalInfo.linkedin ? `<br>${personalInfo.linkedin}` : ''}
                    ${personalInfo.portfolio ? ` • ${personalInfo.portfolio}` : ''}
                </div>
            </div>
            
            ${summary ? `
            <div class="resume-section">
                <h2>Executive Summary</h2>
                <p>${summary}</p>
            </div>
            ` : ''}
            
            ${experience.filter(e => e.title || e.company).length > 0 ? `
            <div class="resume-section">
                <h2>Professional Experience</h2>
                ${experience.filter(e => e.title || e.company).map(exp => `
                    <div class="experience-item-preview">
                        <div class="job-title">${exp.title || 'Job Title'}</div>
                        <div class="company-info">${exp.company || 'Company'}${exp.location ? ` • ${exp.location}` : ''}</div>
                        <div class="company-info">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</div>
                        ${exp.description ? `<div class="job-description">${exp.description}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${education.filter(e => e.degree || e.school).length > 0 ? `
            <div class="resume-section">
                <h2>Education</h2>
                ${education.filter(e => e.degree || e.school).map(edu => `
                    <div class="education-item-preview">
                        <div class="job-title">${edu.degree || 'Degree'}</div>
                        <div class="company-info">${edu.school || 'School'}${edu.location ? ` • ${edu.location}` : ''}</div>
                        ${edu.graduationYear ? `<div class="company-info">${edu.graduationYear}</div>` : ''}
                        ${edu.gpa ? `<div class="company-info">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                ${skills.filter(s => s.name).length > 0 ? `
                <div class="resume-section">
                    <h2>Core Competencies</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 5px;">
                        ${skills.filter(s => s.name).map(skill => `<div>• ${skill.name}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${certifications.filter(c => c.name).length > 0 ? `
                <div class="resume-section">
                    <h2>Certifications</h2>
                    ${certifications.filter(c => c.name).map(cert => `
                        <div class="cert-item-preview">
                            <div>${cert.name}</div>
                            <div class="company-info">${cert.issuer || 'Organization'}${cert.year ? ` • ${cert.year}` : ''}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }

    renderTechnicalTemplate(container) {
        const { personalInfo, summary, experience, education, skills, certifications } = this.resumeData;
        
        container.innerHTML = `
            <div class="resume-header">
                <h1>$ ${personalInfo.fullName || 'Your Name'}</h1>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 15px; font-size: 12px;">
                    ${personalInfo.email ? `<div>📧 ${personalInfo.email}</div>` : ''}
                    ${personalInfo.phone ? `<div>📱 ${personalInfo.phone}</div>` : ''}
                    ${personalInfo.address ? `<div>📍 ${personalInfo.address}</div>` : ''}
                    ${personalInfo.linkedin ? `<div>🔗 ${personalInfo.linkedin}</div>` : ''}
                    ${personalInfo.portfolio ? `<div>🌐 ${personalInfo.portfolio}</div>` : ''}
                </div>
            </div>
            
            ${summary ? `
            <div class="resume-section">
                <h2>// Technical Profile</h2>
                <p>${summary}</p>
            </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
                <div>
                    ${experience.filter(e => e.title || e.company).length > 0 ? `
                    <div class="resume-section">
                        <h2>// Experience</h2>
                        ${experience.filter(e => e.title || e.company).map(exp => `
                            <div class="experience-item-preview">
                                <div class="job-title">${exp.title || 'Job Title'}</div>
                                <div class="company-info">${exp.company || 'Company'} | ${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</div>
                                ${exp.description ? `<div class="job-description">${exp.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <div>
                    ${skills.filter(s => s.name).length > 0 ? `
                    <div class="resume-section">
                        <h2>// Technical Skills</h2>
                        ${skills.filter(s => s.name).map(skill => `
                            <div style="margin-bottom: 8px;">
                                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                                    <span>${skill.name}</span>
                                    <span>${skill.level}%</span>
                                </div>
                                <div style="height: 4px; background: #1e293b; border-radius: 2px;">
                                    <div style="height: 100%; background: #10b981; border-radius: 2px; width: ${skill.level}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${education.filter(e => e.degree || e.school).length > 0 ? `
                    <div class="resume-section">
                        <h2>// Education</h2>
                        ${education.filter(e => e.degree || e.school).map(edu => `
                            <div class="education-item-preview">
                                <div class="job-title">${edu.degree || 'Degree'}</div>
                                <div class="company-info">${edu.school || 'School'}</div>
                                ${edu.graduationYear ? `<div class="company-info">${edu.graduationYear}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${certifications.filter(c => c.name).length > 0 ? `
                    <div class="resume-section">
                        <h2>// Certifications</h2>
                        ${certifications.filter(c => c.name).map(cert => `
                            <div class="cert-item-preview">
                                <div style="font-size: 11px; font-weight: 500;">${cert.name}</div>
                                <div class="company-info">${cert.issuer || 'Organization'} ${cert.year ? `(${cert.year})` : ''}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderCreativeTemplate(container) {
        const { personalInfo, summary, experience, education, skills, certifications } = this.resumeData;
        
        container.innerHTML = `
            <div class="resume-header">
                <h1>${personalInfo.fullName || 'Your Name'}</h1>
                <div style="margin-top: 15px; font-size: 13px;">
                    ${personalInfo.email ? `${personalInfo.email}` : ''}
                    ${personalInfo.phone ? ` • ${personalInfo.phone}` : ''}
                    ${personalInfo.address ? ` • ${personalInfo.address}` : ''}
                    ${personalInfo.linkedin ? `<br>${personalInfo.linkedin}` : ''}
                    ${personalInfo.portfolio ? ` • ${personalInfo.portfolio}` : ''}
                </div>
            </div>
            
            ${summary ? `
            <div class="resume-section">
                <h2>Creative Vision</h2>
                <p style="font-style: italic; color: #6b7280;">${summary}</p>
            </div>
            ` : ''}
            
            ${experience.filter(e => e.title || e.company).length > 0 ? `
            <div class="resume-section">
                <h2>Experience</h2>
                ${experience.filter(e => e.title || e.company).map(exp => `
                    <div class="experience-item-preview">
                        <div class="job-title">${exp.title || 'Job Title'}</div>
                        <div class="company-info" style="color: #8b5cf6;">${exp.company || 'Company'}${exp.location ? ` • ${exp.location}` : ''}</div>
                        <div class="company-info">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</div>
                        ${exp.description ? `<div class="job-description">${exp.description}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
                ${skills.filter(s => s.name).length > 0 ? `
                <div class="resume-section">
                    <h2>Creative Skills</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${skills.filter(s => s.name).map(skill => `
                            <span style="background: linear-gradient(135deg, #ec4899, #06b6d4); color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px;">${skill.name}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${education.filter(e => e.degree || e.school).length > 0 ? `
                <div class="resume-section">
                    <h2>Education</h2>
                    ${education.filter(e => e.degree || e.school).map(edu => `
                        <div class="education-item-preview">
                            <div class="job-title">${edu.degree || 'Degree'}</div>
                            <div class="company-info">${edu.school || 'School'}</div>
                            ${edu.graduationYear ? `<div class="company-info">${edu.graduationYear}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${certifications.filter(c => c.name).length > 0 ? `
                <div class="resume-section">
                    <h2>Certifications</h2>
                    ${certifications.filter(c => c.name).map(cert => `
                        <div class="cert-item-preview">
                            <div style="font-weight: 500;">${cert.name}</div>
                            <div class="company-info">${cert.issuer || 'Organization'}${cert.year ? ` • ${cert.year}` : ''}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const [year, month] = dateString.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    saveData() {
        try {
            localStorage.setItem('resumeBuilderData', JSON.stringify(this.resumeData));
            localStorage.setItem('resumeBuilderTemplate', this.currentTemplate);
            this.showNotification('Resume saved successfully!', 'success');
        } catch (error) {
            this.showNotification('Error saving resume. Please try again.', 'error');
        }
    }

    autoSave() {
        try {
            localStorage.setItem('resumeBuilderData', JSON.stringify(this.resumeData));
            localStorage.setItem('resumeBuilderTemplate', this.currentTemplate);
        } catch (error) {
            // Silent fail for auto-save
        }
    }

    downloadResume() {
        try {
            const resumeContent = this.generateResumeHTML();
            const blob = new Blob([resumeContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.resumeData.personalInfo.fullName || 'Resume'}_${this.currentTemplate}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Resume downloaded successfully!', 'success');
        } catch (error) {
            this.showNotification('Error downloading resume. Please try again.', 'error');
        }
    }

    generateResumeHTML() {
        const preview = document.getElementById('resumePreview');
        const resumeHTML = preview.innerHTML;
        
        const templateStyles = this.getTemplateCSS();
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.resumeData.personalInfo.fullName || 'Resume'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        ${templateStyles}
        @media print {
            body { margin: 0; }
            .resume-preview { box-shadow: none; margin: 0; }
        }
    </style>
</head>
<body>
    <div class="resume-preview ${this.currentTemplate}">
        ${resumeHTML}
    </div>
</body>
</html>`;
    }

    getTemplateCSS() {
        return `
        body { margin: 0; padding: 20px; background: #f5f5f5; }
        .resume-preview {
            background: white;
            color: #333;
            font-family: 'Inter', sans-serif;
            line-height: 1.4;
            max-width: 8.5in;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            min-height: 11in;
            padding: 40px;
        }
        
        .modern {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
        }
        
        .modern .resume-sidebar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
        }
        
        .modern .resume-main {
            padding: 30px;
        }
        
        .modern .resume-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            color: white;
        }
        
        .modern .contact-info {
            font-size: 11px;
            line-height: 1.6;
        }
        
        .executive {
            font-family: 'Times New Roman', serif;
            padding: 40px;
        }
        
        .executive .resume-header {
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .executive .resume-header h1 {
            color: #2c3e50;
            font-size: 32px;
            font-weight: bold;
        }
        
        .executive .resume-section h2 {
            color: #2c3e50;
            font-size: 16px;
            text-transform: uppercase;
            border-left: 4px solid #2c3e50;
            padding-left: 15px;
            margin-bottom: 20px;
        }
        
        .creative {
            font-family: 'Poppins', sans-serif;
            padding: 30px;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
        }
        
        .creative .resume-header {
            text-align: center;
            background: linear-gradient(135deg, #ec4899, #06b6d4);
            color: white;
            padding: 30px;
            border-radius: 20px;
            margin-bottom: 30px;
        }
        
        .creative .resume-header h1 {
            color: white;
            font-size: 30px;
            font-weight: 300;
        }
        
        .creative .resume-section h2 {
            color: #ec4899;
            font-size: 18px;
            font-weight: 300;
            margin-bottom: 20px;
            position: relative;
        }
        
        .creative .resume-section h2:after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 2px;
            background: linear-gradient(90deg, #ec4899, #06b6d4);
        }
        
        .technical {
            font-family: 'Fira Code', monospace;
            padding: 30px;
            background: #0f172a;
            color: #f1f5f9;
        }
        
        .technical .resume-header {
            background: #1e293b;
            padding: 20px;
            border-left: 5px solid #10b981;
            margin-bottom: 30px;
        }
        
        .technical .resume-header h1 {
            color: #10b981;
            font-size: 28px;
        }
        
        .technical .resume-section h2 {
            color: #10b981;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .resume-section {
            margin-bottom: 25px;
        }
        
        .resume-section h2 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .experience-item-preview,
        .education-item-preview,
        .cert-item-preview {
            margin-bottom: 20px;
        }
        
        .job-title {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 4px;
        }
        
        .company-info {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
        }
        
        .job-description {
            font-size: 11px;
            color: #444;
            line-height: 1.5;
            white-space: pre-line;
        }
        
        .skill-bar {
            margin-bottom: 12px;
        }
        
        .skill-name {
            font-size: 11px;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .skill-progress {
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .skill-progress-fill {
            height: 100%;
            background: white;
            border-radius: 2px;
        }
        `;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the resume builder when the page loads
let resumeBuilder;
document.addEventListener('DOMContentLoaded', () => {
    resumeBuilder = new ResumeBuilder();
});

// Prevent form submission
document.addEventListener('submit', (e) => {
    e.preventDefault();
});