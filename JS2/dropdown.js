    //? Sets the font-family for option elements to "Rague"
    document.addEventListener('DOMContentLoaded', function() 
    {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = 'option { font-family: "Rague" !important; }';
      document.head.appendChild(style);
    });

    //? Opens the specified dropdown with an animation
    function openDropdown(dropdown)
    {
      dropdown.style.opacity = '0';
      dropdown.style.display = 'block';
      setTimeout(function()
      {
        dropdown.classList.add('dropdown-open');
        dropdown.style.opacity = '1';
      }, 10); // Delay for smoother animation start
    }

    //? Closes the specified dropdown with an animation
    function closeDropdown(dropdown)
    {
      dropdown.classList.remove('dropdown-open');
      dropdown.classList.add('dropdown-close');
      dropdown.style.opacity = '0';

      setTimeout(function()
      {
        dropdown.style.display = 'none';
        dropdown.classList.remove('dropdown-close');
        dropdown.style.opacity = '1';
      }, 300); // Adjust to match animation duration
    }

    //? Toggles the specified dropdown, closing any other open dropdowns
    function toggleDropdown(dropdownId)
    {
      var dropdown = document.getElementById(dropdownId);

      if (dropdown.style.display === 'block')
      {
        closeDropdown(dropdown);
      }
      else
      {
        closeAllDropdowns(); // Close all other dropdowns
        openDropdown(dropdown);
      }
    }

    //? Closes all open dropdowns when clicking outside of them
    document.addEventListener('click', function(event)
    {
      var target = event.target;
      if (!target.closest('.dropdown') && !target.closest('.dropdown-content'))
      {
        closeAllDropdowns();
      }
    });

    //? Closes all open dropdowns
    function closeAllDropdowns()
    {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      for (var i = 0; i < dropdowns.length; i++)
      {
        var dropdown = dropdowns[i];
        if (dropdown.style.display === 'block')
        {
          closeDropdown(dropdown);
        }
      }
    }

    //? Selects the player count and updates the button text
    function selectPlayerCount(count)
    {
      document.getElementById('playerCountBtn').innerText = count;
      toggleDropdown('playerCountDropdown');

      playerCount = count;
    }

    //? Selects the board type and updates the button text
    function selectBoardType(type)
    {
      if (type === 'chess')
      {
        document.getElementById('boardTypeBtn').innerText = 'Chess Style';
        toggleDropdown('boardTypeDropdown');
    
        boardType = 'chess';
      }
    }

//, Max Stack Decision
function msDecision(callback) 
{
      // Create decision menu elements
      const decisionMenu = document.createElement('div');
      decisionMenu.id = 'decisionMenu';
      decisionMenu.style.display = 'none';
      decisionMenu.style.position = 'fixed';
      decisionMenu.style.top = '50%';
      decisionMenu.style.left = '50%';
      decisionMenu.style.transform = 'translate(-50%, -50%)';
      decisionMenu.style.backgroundColor = cssVarGet('--color4'); // Use CSS variable
      decisionMenu.style.padding = '40px';
      decisionMenu.style.border = `2px solid ${cssVarGet('--color1')}`; // Use CSS variable
      decisionMenu.style.borderRadius = '5px';
      decisionMenu.style.zIndex = '9999';
      decisionMenu.style.textAlign = 'center'; // Center align content
  
      const title = document.createElement('h2');
      title.textContent = 'Max Stack Type';
      title.style.color = cssVarGet('--color1');
  
      const option1Btn = document.createElement('button');
      // Update buttons with larger quotes
      option1Btn.innerHTML = 'Diagonal<br><span style="font-size: 50px;">“</span>'
      option1Btn.style.width = '100px'; // Set square button width
      option1Btn.style.height = '100px'; // Set square button height
      option1Btn.style.borderRadius = '5px';
      option1Btn.style.backgroundColor = cssVarGet('--color2'); // Use CSS variable
      option1Btn.style.color = cssVarGet('--color4'); // Use CSS variable
      option1Btn.style.transition = 'background-color 0.3s, color 0.3s'; // Transition effect
      option1Btn.addEventListener('click', () => {
        document.body.removeChild(decisionMenu); // Remove menu from DOM
        callback("orth"); // return with option 1
      });
      option1Btn.addEventListener('mouseenter', () => {
        option1Btn.style.backgroundColor = cssVarGet('--color1'); // Change background color on hover
        option1Btn.style.color = cssVarGet('--color2'); // Change text color on hover
      });
      option1Btn.addEventListener('mouseleave', () => {
        option1Btn.style.backgroundColor = cssVarGet('--color2'); // Revert background color on hover out
        option1Btn.style.color = cssVarGet('--color4'); // Revert text color on hover out
      });
  
      const orText = document.createElement('span');
      orText.textContent = 'OR';
      orText.style.display = 'inline-block'; // Make OR text inline-block to center it
      orText.style.margin = '0 10px'; // Add margin around OR text
      orText.style.color = cssVarGet('--color3'); // Use CSS variable for text color
  
      const option2Btn = document.createElement('button');
      option2Btn.innerHTML = 'Orthogonal<br><span style="font-size: 50px;">”</span>';
      option2Btn.style.width = '100px'; // Set square button width
      option2Btn.style.height = '100px'; // Set square button height
      option2Btn.style.borderRadius = '5px';
      option2Btn.style.backgroundColor = cssVarGet('--color2'); // Use CSS variable
      option2Btn.style.color = cssVarGet('--color4'); // Use CSS variable
      option2Btn.style.transition = 'background-color 0.3s, color 0.3s'; // Transition effect
      option2Btn.addEventListener('click', () => {
        document.body.removeChild(decisionMenu); // Remove menu from DOM
        callback("diag"); // Resolve with option 0
      });
      option2Btn.addEventListener('mouseenter', () => {
        option2Btn.style.backgroundColor = cssVarGet('--color1'); // Change background color on hover
        option2Btn.style.color = cssVarGet('--color2'); // Change text color on hover
      });
      option2Btn.addEventListener('mouseleave', () => {
        option2Btn.style.backgroundColor = cssVarGet('--color2'); // Revert background color on hover out
        option2Btn.style.color = cssVarGet('--color4'); // Revert text color on hover out
      });
  
      // Append elements to decision menu
      decisionMenu.appendChild(title);
      decisionMenu.appendChild(option1Btn);
      decisionMenu.appendChild(orText);
      decisionMenu.appendChild(option2Btn);
  
      // Append decision menu to body
      document.body.appendChild(decisionMenu);
  
      // Show decision menu
      decisionMenu.style.display = 'block';
}
  