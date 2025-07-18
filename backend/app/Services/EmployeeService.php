<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\EmployeeRepositoryInterface;
use App\Models\Employee;
use Illuminate\Http\UploadedFile;

class EmployeeService
{
    private EmployeeRepositoryInterface $employeeRepository;

    public function __construct(EmployeeRepositoryInterface $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * Create a new employee
     */
    public function createEmployee(array $data): Employee
    {
        // Handle profile photo upload - support both field names
        if (isset($data['profile_photo']) && $data['profile_photo'] instanceof UploadedFile) {
            $data['profilePhoto'] = $this->employeeRepository->storeFile($data['profile_photo']);
            unset($data['profile_photo']); // Remove the original key
        } elseif (isset($data['profilePhoto']) && $data['profilePhoto'] instanceof UploadedFile) {
            $data['profilePhoto'] = $this->employeeRepository->storeFile($data['profilePhoto']);
        }

        return $this->employeeRepository->create($data);
    }

    /**
     * Update an existing employee
     */
    public function updateEmployee(string $id, array $data): ?Employee
    {
        // Handle profile photo upload - support both field names
        if (isset($data['profile_photo']) && $data['profile_photo'] instanceof UploadedFile) {
            $data['profilePhoto'] = $this->employeeRepository->storeFile($data['profile_photo']);
            unset($data['profile_photo']); // Remove the original key
        } elseif (isset($data['profilePhoto']) && $data['profilePhoto'] instanceof UploadedFile) {
            $data['profilePhoto'] = $this->employeeRepository->storeFile($data['profilePhoto']);
        }

        return $this->employeeRepository->update($id, $data);
    }

    /**
     * Get available options for dropdowns
     */
    public function getDropdownOptions(): array
    {
        return [
            'genders' => ['male', 'female', 'other'],
            'maritalStatuses' => ['single', 'married', 'divorced', 'widowed'],
            'departments' => ['hr', 'engineering', 'marketing', 'sales', 'finance', 'operations'],
            'nationalities' => [
                'afghan', 'albanian', 'algerian', 'american', 'andorran', 'angolan', 'antiguans',
                'argentinean', 'armenian', 'australian', 'austrian', 'azerbaijani', 'bahamian',
                'bahraini', 'bangladeshi', 'barbadian', 'barbudans', 'batswana', 'belarusian',
                'belgian', 'belizean', 'beninese', 'bhutanese', 'bolivian', 'bosnian', 'brazilian',
                'british', 'bruneian', 'bulgarian', 'burkinabe', 'burmese', 'burundian', 'cambodian',
                'cameroonian', 'canadian', 'cape verdean', 'central african', 'chadian', 'chilean',
                'chinese', 'colombian', 'comoran', 'congolese', 'costa rican', 'croatian', 'cuban',
                'cypriot', 'czech', 'danish', 'djibouti', 'dominican', 'dutch', 'east timorese',
                'ecuadorean', 'egyptian', 'emirian', 'equatorial guinean', 'eritrean', 'estonian',
                'ethiopian', 'fijian', 'filipino', 'finnish', 'french', 'gabonese', 'gambian',
                'georgian', 'german', 'ghanaian', 'greek', 'grenadian', 'guatemalan', 'guinea-bissauan',
                'guinean', 'guyanese', 'haitian', 'herzegovinian', 'honduran', 'hungarian', 'icelander',
                'indian', 'indonesian', 'iranian', 'iraqi', 'irish', 'israeli', 'italian', 'ivorian',
                'jamaican', 'japanese', 'jordanian', 'kazakhstani', 'kenyan', 'kittian and nevisian',
                'kuwaiti', 'kyrgyz', 'laotian', 'latvian', 'lebanese', 'liberian', 'libyan',
                'liechtensteiner', 'lithuanian', 'luxembourger', 'macedonian', 'malagasy', 'malawian',
                'malaysian', 'maldivan', 'malian', 'maltese', 'marshallese', 'mauritanian', 'mauritian',
                'mexican', 'micronesian', 'moldovan', 'monacan', 'mongolian', 'moroccan', 'mosotho',
                'motswana', 'mozambican', 'namibian', 'nauruan', 'nepalese', 'new zealander',
                'ni-vanuatu', 'nicaraguan', 'nigerien', 'nigerian', 'north korean', 'northern irish',
                'norwegian', 'omani', 'pakistani', 'palauan', 'palestinian', 'panamanian',
                'papua new guinean', 'paraguayan', 'peruvian', 'polish', 'portuguese', 'qatari',
                'romanian', 'russian', 'rwandan', 'saint lucian', 'salvadoran', 'samoan',
                'san marinese', 'sao tomean', 'saudi', 'scottish', 'senegalese', 'serbian',
                'seychellois', 'sierra leonean', 'singaporean', 'slovakian', 'slovenian',
                'solomon islander', 'somali', 'south african', 'south korean', 'spanish',
                'sri lankan', 'sudanese', 'surinamer', 'swazi', 'swedish', 'swiss', 'syrian',
                'taiwanese', 'tajik', 'tanzanian', 'thai', 'togolese', 'tongan', 'trinidadian',
                'tunisian', 'turkish', 'tuvaluan', 'ugandan', 'ukrainian', 'uruguayan', 'uzbekistani',
                'venezuelan', 'vietnamese', 'welsh', 'yemenite', 'zambian', 'zimbabwean'
            ],
        ];
    }
}
