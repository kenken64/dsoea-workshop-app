---
title: "Workshop 9"
order: 3
submission: |
  # Workshop 9 - CI/CD Pipeline Design Submission

  ## Instructions

  Students are required to prepare and upload a design proposal document to NUS Canvas covering:

  1. **Pipeline Diagram** - An end-to-end CI/CD pipeline diagram for the proposed solution
  2. **Technology Stack** - A list of all DevOps tools and technologies used at each stage
  3. **Written Proposal** - A short write-up addressing each of the requirements listed in this workshop

  ## Submission Guidelines

  1. Export your proposal (diagram + write-up) as a single PDF document
  2. Ensure the pipeline diagram clearly shows each stage from source control to deployment
  3. Upload the PDF to the designated NUS Canvas assignment folder
  4. Name your file as: `workshop9_<your_name>.pdf`

  ## Deadline

  Please refer to NUS Canvas for the submission deadline.
---

# S-DOEA – Workshop 9: Designing a Comprehensive End-to-End CI/CD Pipeline

## Objective

Design and propose a CI/CD pipeline for StoolViriiDetect Pte Ltd's COVID-19 IoT Project.

## Background

In support of early detection of COVID-19 clusters, SG GovHighTech has awarded StoolViriiDetect Pte Ltd a nationwide contract to deploy its stool-based viral detection sensor solution across all residential areas in Singapore. Sensor data must be transmitted to the Health Authority twice daily via a secure cloud channel for analysis. Your team is tasked with proposing a robust, end-to-end CI/CD pipeline to support the delivery and ongoing operation of this solution.

## Requirements and Considerations

The proposed solution should address the following:

- A public-facing web application and API featuring a geolocation-based map that visualises potential COVID-19 clusters.
- A private web application providing an enhanced cluster map with additional operational and analytical information for authorised personnel.
- Integration with the TraceTogether mobile application to deliver near real-time notifications to users regarding newly identified potential clusters.
- Over-the-air (OTA) firmware update capability for all deployed sensors to ensure continuous improvement and security patching.
- A clear articulation of the DevOps toolchain and technology stack proposed for both the pipeline and the overall implementation.
- A region-based architecture that segments the solution by geographical areas within Singapore.

## Reference Materials

- https://www.youtube.com/watch?v=XeFOpSNgSGk
- https://www.youtube.com/watch?v=nN9d_bLE-vM&t=127s
