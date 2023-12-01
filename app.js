function app() {
    // HEADER ELEMENTS
    const searchBar = document.querySelector("#search-bar")
    const triggersContainer = document.querySelector("#header-popups")
    const popupTriggers = [...document.querySelectorAll(".js-popup-trigger")]
    const popups = [...document.querySelectorAll(".js-popup")]

    //CALLOUT ELEMENTS
    const trialCallout = document.querySelector("#trial-callout")
    const closeTrialCalloutBtn = document.querySelector("#close-trial-callout-btn")

    //SET UP GUIDE ELEMENTS
    const onboardingStepsTrigger = document.querySelector("#onboarding-steps-trigger")
    const stepsTriggerIconTitle = document.querySelector("#sr-arrow-up")
    const setUpTiggerIcon = document.querySelector("#setup-arrow")

    //ONBOARDING STEPS ELEMENTS
    const onboardingStepsWrapper = document.querySelector("#onboarding-steps-wrapper")
    const onBoardingSteps = [...document.querySelectorAll(".js-onboarding-step")]
    const stepCheckboxes = [...document.querySelectorAll(".js-step-checkbox")]
    const stepsTriggers = [...document.querySelectorAll(".js-step-trigger")]
    const allStepsDetails = [...document.querySelectorAll(".js-step-details")]
    const notCompletedIcons = [...document.querySelectorAll(".js-not-completed-icon")]
    const spinnerIcons = [...document.querySelectorAll(".js-spinner-icon")]
    const completedIcons = [...document.querySelectorAll(".js-completed-icon")]
    const setupProgressBar = document.querySelector("#setup-progress-bar")
    const setupProgressLabel = document.querySelector("#setup-progress-label")
    const COMPLETED_STEP_CLASS = "step-completed"

    //ARIA LIVE
    const checkboxStatus = document.querySelector("#onboarding-step-completions-status")
    const onboardingStepVisibilityStatus = document.querySelector("#onboarding-step-visibility-status")

    addEventListeners()


    /* ============================================== EVENT LISTENERS ==============================================*/
    function addEventListeners() {
        preventSearchFormSubmission()
        togglePopUp()
        handleCloseTrialCalloutBtnClick()
        toggleOnboardingSteps()
        handleCheckboxClick()
        handleStepHeadingClick()
    }


    /* ============================================== HEADER SEARCH INPUT ==============================================*/
    function preventSearchFormSubmission() {
        searchBar.addEventListener("submit", event=> {
            event.preventDefault()
        })
    }


    /* ============================================== HEADER POP-UPS ==============================================*/
    //Closes a targeted popup if expanded and opens it if not 
    //Toggles both the alerts panel and the admin menu depending on which trigger was clicked.
    function togglePopUp() {
        popupTriggers.forEach((trigger, triggerIndex)=> {
            trigger.addEventListener("click", ()=> {
                const isExpanded = trigger.getAttribute("aria-expanded") === "true";
                const popup = popups[triggerIndex];
                const focuseablePopupItems = popup.querySelectorAll("a, button");

                if(isExpanded) {
                    closePopup(trigger, popup)
                } else {
                    openPopup(trigger, popup, focuseablePopupItems)
                }

                handleMultipleTriggers(triggerIndex)
            })
        })
    }     
     
    function closePopup(trigger, popup) {
        trigger.setAttribute("aria-expanded", "false");
        popup.classList.remove("active")
        trigger.focus()
    }

    function openPopup(trigger, popup, focuseablePopupItems) {
        trigger.setAttribute("aria-expanded", "true");
        popup.classList.add("active")

        handlePopupEscapeKeyPress(trigger, popup)
        handleFocuseablePopupItems(focuseablePopupItems)
        handlePopupOnClickOutside(trigger, popup)
    }

    //Closes an open pop up when the escape key is pressed
    function handlePopupEscapeKeyPress(trigger, popup) {
        triggersContainer.addEventListener("keyup", (event)=> {
            if(event.key === "Escape") {
                closePopup(trigger, popup)
            }
        })
    }

    //Focuses on the first item in the pop up when opened.
    //Focuses on the corresponding pop up item on key press
    function handleFocuseablePopupItems(focuseablePopupItems) {
        if(focuseablePopupItems.length > 0) {
            focuseablePopupItems.item(0).focus()

            focuseablePopupItems.forEach( (item, itemIndex, itemsArray)=> (
                item.addEventListener("keyup", (event)=> {
                    handleFocuseablePopupItemArrowKeyPress(event, itemIndex, itemsArray)
                })
            ))
        }
    }

    function handleFocuseablePopupItemArrowKeyPress(event, popUpItemIndex, popUpItems) {
        const isPreviousItem = event.key === "ArrowUp" || event.key === "ArrowLeft"
        const isNextItem = event.key === "ArrowDown" || event.key === "ArrowRight"
        const nextMenuItem = popUpItems[popUpItemIndex + 1]
        const previousItem = popUpItems[popUpItemIndex - 1]
        const lastItem = popUpItems[popUpItems.length - 1]
        const firstItem = popUpItems[0]
        const isLastItem = event.target === lastItem
        const isFirstItem = event.target === firstItem

        if(isPreviousItem) {
            if(isFirstItem) {
                lastItem.focus()
                return;
            }
            previousItem.focus()
        } else if (isNextItem) {
            if(isLastItem) {
                firstItem.focus()
                return;
            }
            nextMenuItem.focus()
        }
    }

    //Closes an open pop up when its surrounding is clicked
    function handlePopupOnClickOutside(trigger, popup) {
        document.addEventListener("click", event=> {
            if(!triggersContainer.contains(event.target)) {
                trigger.setAttribute("aria-expanded", "false");
                popup.classList.remove("active")
            }
        })
    }

    function handleMultipleTriggers(triggerIndex) {
        popups.forEach((popup, popupIndex)=> {
            const isAnyPopupOpen = popup.classList.contains("active") && popupIndex !== triggerIndex
            if(isAnyPopupOpen) {
                const openPopupTrigger = popupTriggers[popupIndex]
                openPopupTrigger.setAttribute("aria-expanded", "false");
                popup.classList.remove("active")
            }
        })
    }


    /* ============================================== CALLOUT ==============================================*/
    function handleCloseTrialCalloutBtnClick() {
        closeTrialCalloutBtn.addEventListener("click", ()=> { 
            trialCallout.style.opacity = 0
            setTimeout(()=> {
                trialCallout.classList.add("hidden")
            } , 350)
        })
    }


    /* ============================================== ONBOARDING ==============================================*/

    // Shows or hides onboarding steps
    function toggleOnboardingSteps() {
        onboardingStepsTrigger.addEventListener('click', ()=>{
            const isStepsVisible = onboardingStepsTrigger.ariaExpanded === "true"
            isStepsVisible ? setOnboardingStepsVisibility(false, true, "Show Steps", "Onboarding Steps Closed") 
                            :  setOnboardingStepsVisibility(true, false, "Hide Steps", "Onboarding Steps Opened")
        })
    }

    function setOnboardingStepsVisibility(isExpandedTrigger, isStepsHidden, triggerIconTitle, statusMessage) {
        onboardingStepsTrigger.ariaExpanded = isExpandedTrigger
        onboardingStepsWrapper.ariaHidden = isStepsHidden
        onboardingStepVisibilityStatus.textContent = statusMessage
        stepsTriggerIconTitle.textContent = triggerIconTitle

        setUpTiggerIcon.classList.toggle("setup-arrow-hidden")
        onboardingStepsWrapper.classList.toggle("steps-hidden")
    }

    /*Marks a step as done or not done depending on if a checkbox contains the COMPLETED_STEP_CLASS or not
     Then updates the progress bar that monitors step completion*/
    function handleCheckboxClick() {
        stepCheckboxes.forEach((checkbox, currentIndex)=> {
            checkbox.addEventListener('click', event=> {

                const isDone = checkbox.classList.contains(COMPLETED_STEP_CLASS)
                isDone ? markOnboardingStepAsNotDone(checkbox, currentIndex) :  markOnboardingStepAsDone(checkbox, currentIndex)

                setProgressBarValue()
            })
        })
    }

    //Removes the COMPLETED_STEP_CLASS from a checkbox with the class and styles the checkbox's state transition 
    function markOnboardingStepAsNotDone(checkbox, currentIndex) {
        handleMarkAsNotDone(checkbox, currentIndex)
        checkbox.classList.remove(COMPLETED_STEP_CLASS)
    }

    function handleMarkAsNotDone(checkbox, currentIndex) {
         const notCompletedIcon = notCompletedIcons[currentIndex]
         const spinnerIcon = spinnerIcons[currentIndex]
         const completedIcon = completedIcons[currentIndex]

            checkboxStatus.textContent = "Loading."
            completedIcon.classList.add("hidden")
            spinnerIcon.classList.remove("hidden")

                    setTimeout(_=> {
                        spinnerIcon.classList.add("hidden")
                        notCompletedIcon.classList.remove("hidden")

                        openCurrentOnboardingStep(currentIndex)
                        closeAllStepsApartFromTarget(currentIndex)

                        const doneMessage = `Successfully marked${checkbox.ariaLabel.split('Mark')[1]}`
                        checkboxStatus.textContent = doneMessage
                        checkbox.ariaLabel = checkbox.ariaLabel.replace("as not done", "as done")
                    }, 800)
    }

    function closeAllStepsApartFromTarget(targetIndex) {
        onBoardingSteps.forEach((step, currentIndex)=> {
            if(currentIndex !== targetIndex) {
                closeStep(currentIndex)
            }
        })
    }

    function closeStep(index) {
        const stepDetails = allStepsDetails[index]
        const stepWrapper = onBoardingSteps[index]
        const stepTrigger = stepsTriggers[index]

            if(stepDetails.classList.contains("active")) {
                stepWrapper.classList.remove("selected-step")
                stepTrigger.setAttribute("aria-expanded", false)
                stepDetails.ariaHidden = true
                stepDetails.classList.remove("active")
            }
    }

    function openCurrentOnboardingStep(currentIndex) {
         openStep(currentIndex)
    }

    //Adds the COMPLETED_STEP_CLASS to a checkbox without the class and styles the checkbox's state transition 
    function markOnboardingStepAsDone(checkbox, currentIndex) {
        handleMarkAsDone(checkbox, currentIndex)
        checkbox.classList.add(COMPLETED_STEP_CLASS)
    }

    function handleMarkAsDone(checkbox, currentIndex) {
        const notCompletedIcon = notCompletedIcons[currentIndex]
        const spinnerIcon = spinnerIcons[currentIndex]
        const completedIcon = completedIcons[currentIndex]
        const nextIndex = findNextStepIndex(currentIndex)

        checkboxStatus.textContent = "Loading."
            notCompletedIcon.classList.add("hidden")
            spinnerIcon.classList.remove("hidden")

                setTimeout(()=>{ 
                    closeAllStepsApartFromTarget(currentIndex)         
                    closeCurrentOnboardingStep(currentIndex)
                    openNextOnboardingStep(nextIndex)
                    spinnerIcon.classList.add("hidden")
                    completedIcon.classList.remove("hidden")
                    
                    const doneMessage = `Successfully marked${checkbox.ariaLabel.split('Mark')[1]}`
                    checkboxStatus.textContent = doneMessage
                    checkbox.ariaLabel = checkbox.ariaLabel.replace("as done", "as not done")
                
                }, 800)
    }

    //Finds the index of an incomplete step after a recently completed one
    function findNextStepIndex(currentIndex) {
        for(i = currentIndex + 1; i < onBoardingSteps.length; i++) {
            if(!stepCheckboxes[i].classList.contains(COMPLETED_STEP_CLASS)) {
                return i + 1 //ONE ADDED TO AVOID GETTING ZERO WHICH IS A FALSY VALUE THAT ALWAYS RETURNS FALSE IN CONDITIONALS
            }
        }
    }

    //Opens the next step after a step has been completed
    function openNextOnboardingStep(nextIndex) {
        nextIndex ? openStep(nextIndex -1) : openStep( findInCompleteStepIndex() )
    }

    //Checks for an incomplete step to open if all the steps after a recently completed step are marked as done
    //Starts from afresh
    function findInCompleteStepIndex() {
        for(i=0; i < stepCheckboxes.length; i++) {
            if(!stepCheckboxes[i].classList.contains(COMPLETED_STEP_CLASS)) {
                return i
            }
        } 
    }

    //Only closes a step when there is still an incomplete step, this ensures that there is always a step open even if they have all been completed.
    function closeCurrentOnboardingStep(currentIndex) {
        const hasAllBeenCompleted = stepCheckboxes.every(checkbox=> checkbox.classList.contains(COMPLETED_STEP_CLASS))
        if(!hasAllBeenCompleted) {
            closeStep(currentIndex)
        }
    }

    /*opens the step with an index matching the targeted element (Can be a checkbox or a heading/trigger button) 
    if there is one and if it does not contain the active class (If it is not open already)*/
    function openStep(index) {
            const stepDetails = allStepsDetails[index]
            const stepWrapper = onBoardingSteps[index]
            const stepTrigger = stepsTriggers[index]
            const stepCheckbox = stepCheckboxes[index]
    
                if(stepDetails && !stepDetails.classList.contains("active")) {
                    stepTrigger.setAttribute("aria-expanded", true)
                    stepWrapper.classList.add("selected-step")
                    stepDetails.classList.add("active")
                    stepDetails.ariaHidden = false
                    stepCheckbox.focus()
                }
    }

    //Checks for the checkboxes with the COMPLETED_STEP_CLASS and returns a value that represents the total steps completed
    function updateSetupProgressValue() {
        return stepCheckboxes.reduce( (totalCompleted, checkbox)=> checkbox.classList.contains(COMPLETED_STEP_CLASS)  ? totalCompleted + 1 : totalCompleted, 0)
    }

    //Sets the value of the set up progress bar to the value returned in updateSetupProgressValue() and Updates the textContent of the progress bar label
    function setProgressBarValue() {
        setupProgressBar.value = updateSetupProgressValue()
        setupProgressLabel.textContent = `${updateSetupProgressValue()} / 5 completed`
    }

    //Checks if a step is currently open when the heading is clicked
    //If it is open, nothing happens
    //if it is not open, it closes any other step, then shows the details of the targeted step 
    function handleStepHeadingClick() {
        stepsTriggers.forEach((trigger, currentIndex)=> {
            trigger.addEventListener('click', e=> {
                const detailsToShow = allStepsDetails[currentIndex]
                const activePanelDetails = allStepsDetails.find(detail=> detail.classList.contains("active"))
                const isdetailsToShowActive = activePanelDetails === detailsToShow
                const activeOnBoardingStep = onBoardingSteps.find(step=> step.classList.contains("selected-step"))
                const activePanelHeading = stepsTriggers.find(trigger=> trigger.ariaExpanded === "true")
                const canShowDetails = !isdetailsToShowActive && trigger.ariaExpanded === "false"

                if(canShowDetails) {
                    activeOnBoardingStep.classList.remove("selected-step")
                    activePanelHeading.setAttribute("aria-expanded", "false") 
                    activePanelDetails.classList.remove("active")
                    openStep(currentIndex)
                }
            })
        })
    }
}

app()