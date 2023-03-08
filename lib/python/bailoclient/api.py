"""Interface for the BAILO API"""

import abc
from typing import Dict, Optional

import zipfile
import subprocess
import io
import requests
import requests_pkcs12
from json import JSONDecodeError
from requests.models import Response

from .auth import AuthenticationInterface, Pkcs12Authenticator, UnauthorizedException
from .config import BailoConfig


class APIInterface(abc.ABC):
    """API interface"""

    @abc.abstractmethod
    def __init__(self, config: BailoConfig, auth: AuthenticationInterface):
        raise NotImplementedError

    @abc.abstractmethod
    def get(
        self,
        request_path: str,
        request_params: Optional[Dict[str, str]],
        headers: Optional[Dict] = None,
    ) -> Dict[str, str]:
        """Make a GET request against the API.
           This will not do any validation of parameters prior to sending.

        Args:
            request_path (str): The requested path relative to the API (e.g. /model/summary)
            request_body (Dict): The full request body as a dict
            request_params (Optional[Dict[str, str]], optional): Any query parameters to be passed
                                                                 to the API. Defaults to None.
            headers (Optional[Dict], optional): request headers. Defaults to None.

        Raises:
            NotImplementedError: Abstract method must be implemented

        Returns:
            Dict[str, str]: A JSON object returned by the API.
                            Returns an empty dictionary if the request fails.
        """
        raise NotImplementedError

    @abc.abstractmethod
    def post(
        self,
        request_path: str,
        request_body: Dict,
        request_params: Optional[Dict[str, str]] = None,
        headers: Optional[Dict] = None,
    ) -> Dict[str, str]:
        """Make a POST request against the API.
           This will not do any validation of parameters prior to sending.

        Args:
            request_path (str): The requested path relative to the API (e.g. /model/summary)
            request_body (Dict): The full request body as a dict
            request_params (Optional[Dict[str, str]], optional): Any query parameters to be passed
                                                                 to the API. Defaults to None.
            headers (Optional[Dict], optional): request headers. Defaults to None.

        Raises:
            NotImplementedError: Abstract method must be implemented

        Returns:
            Dict[str, str]: A JSON object returned by the API.
                            Returns an empty dictionary if the request fails.
        """
        raise NotImplementedError

    @abc.abstractmethod
    def put(
        self,
        request_path: str,
        request_body: Dict,
        request_params: Optional[Dict[str, str]] = None,
        headers: Optional[Dict] = None,
    ) -> Dict[str, str]:
        """Make a PUT request against the API.
           This will not do any validation of parameters prior to sending.

        Args:
            request_path (str): The requested path relative to the API (e.g. /model/summary)
            request_body (Dict): The full request body as a dict
            request_params (Optional[Dict[str, str]], optional): Any query parameters to be passed
                                                                 to the API. Defaults to None.
            headers (Optional[Dict], optional): request headers. Defaults to None.

        Raises:
            NotImplementedError: Abstract method must be implemented

        Returns:
            Dict[str, str]: A JSON object returned by the API.
                            Returns an empty dictionary if the request fails.
        """
        raise NotImplementedError


class AuthorisedAPI(APIInterface):
    """Authorised API interface"""

    def __init__(self, config: BailoConfig, auth: AuthenticationInterface):
        self.config = config
        self.auth = auth
        self.verify_certificates = self.config.api.ca_verify
        self.timeout_period = 5  # timeout periods in seconds

    def _form_url(self, request_path: str) -> str:
        if request_path.startswith("/"):
            return f"{self.config.api.url}{request_path}"

        return f"{self.config.api.url}/{request_path}"

    def _get_headers(self, input_headers: Optional[Dict] = None) -> Dict[str, str]:
        if input_headers:
            input_headers.update(self.auth.get_authorisation_headers())
            return input_headers

        return self.auth.get_authorisation_headers()

    def get(
        self,
        request_path: str,
        request_params: Optional[Dict[str, str]] = None,
        headers: Optional[Dict] = None,
        output_dir: Optional[str] = None,
    ) -> Dict[str, str]:
        """Make a GET request against the API.
           This will not do any validation of parameters prior to sending.

        Args:
            request_path (str): The requested path relative to the API (e.g. /model/summary)
            request_params (Optional[Dict[str, str]]): Any query parameters to be passed to the API
            headers (Optional[Dict], optional): A JSON object returned by the API.
                                                Returns an empty dictionary if the request fails.
                                                Defaults to None.

        Raises:
            UnauthorizedException: Unable to access the server

        Returns:
            Dict[str, str]: Response JSON from the server
        """

        url = self._form_url(request_path)
        headers = self._get_headers(headers)

        response = None
        if isinstance(self.auth, Pkcs12Authenticator):
            response = requests_pkcs12.get(
                url,
                pkcs12_filename=self.config.pki.pkcs12_filename,
                pkcs12_password=self.config.pki.pkcs12_password,
                params=request_params,
                headers=headers,
                timeout=self.timeout_period,
                verify=self.verify_certificates,
            )
        else:
            response = requests.get(
                url,
                params=request_params,
                headers=headers,
                timeout=self.timeout_period,
                verify=self.verify_certificates,
            )

        return self._handle_response(response, output_dir)

    def post(
        self,
        request_path: str,
        request_body: Dict,
        request_params: Optional[Dict[str, str]] = None,
        headers: Optional[Dict] = None,
    ) -> Dict[str, str]:
        """Make a POST request against the API.
           This will not do any validation of parameters prior to sending.

        Args:
            request_path (str): The requested path relative to the API (e.g. /model/summary)
            request_params (Optional[Dict[str, str]]): Any query parameters to be passed to the API
            headers (Optional[Dict], optional): A JSON object returned by the API.
                                                Returns an empty dictionary if the request fails.
                                                Defaults to None.

        Raises:
            UnauthorizedException: Unable to access the server

        Returns:
            Dict[str, str]: Response JSON from the server
        """
        url = self._form_url(request_path)
        headers = self._get_headers(headers)

        response = None
        if isinstance(self.auth, Pkcs12Authenticator):
            response = requests_pkcs12.get(
                url,
                pkcs12_filename=self.config.pki.pkcs12_filename,
                pkcs12_password=self.config.pki.pkcs12_password,
                data=request_body,
                params=request_params,
                headers=headers,
                timeout=self.timeout_period,
                verify=self.verify_certificates,
            )
        else:
            response = requests.post(
                url,
                data=request_body,
                params=request_params,
                headers=headers,
                timeout=self.timeout_period,
                verify=self.verify_certificates,
            )

        return self._handle_response(response)

    def put(
        self,
        request_path: str,
        request_body: Dict,
        request_params: Optional[Dict[str, str]] = None,
        headers: Optional[Dict] = None,
    ) -> Dict[str, str]:
        """Make a PUT request against the API.
           This will not do any validation of parameters prior to sending.

        Args:
            request_path (str): The requested path relative to the API (e.g. /model/summary)
            request_params (Optional[Dict[str, str]]): Any query parameters to be passed to the API
            headers (Optional[Dict], optional): A JSON object returned by the API.
                                                Returns an empty dictionary if the request fails.
                                                Defaults to None.

        Raises:
            UnauthorizedException: Unable to access the server

        Returns:
            Dict[str, str]: Response JSON from the server
        """

        url = self._form_url(request_path)
        headers = self._get_headers(headers)

        response = None
        if isinstance(self.auth, Pkcs12Authenticator):
            response = requests_pkcs12.get(
                url,
                pkcs12_filename=self.config.pki.pkcs12_filename,
                pkcs12_password=self.config.pki.pkcs12_password,
                data=request_body,
                params=request_params,
                headers=headers,
                timeout=self.timeout_period,
                verify=self.verify_certificates,
            )
        else:
            response = requests.put(
                url,
                data=request_body,
                params=request_params,
                headers=headers,
                timeout=self.timeout_period,
                verify=self.verify_certificates,
            )

        return self._handle_response(response)

    def _handle_response(self, response: Response, output_dir: str = None):
        """Handle the response from the server

        Args:
            response (Response): Response from the server
            output_dir (str): Directory to download any files to

        Raises:
            UnauthorizedException: Unathorised to access server

        Returns:
            str: Response status or message
        """

        if 200 <= response.status_code < 300:
            if output_dir:
                self.__decode_file_content(response.content, output_dir)
                return response.status_code

            else:
                return response.json()

        if response.status_code == 401:
            try:
                data = response.json()
                raise UnauthorizedException(data)
            except JSONDecodeError:
                response.raise_for_status()

        try:
            data = response.json()
            return data

        except:
            response.raise_for_status()

    def __decode_file_content(self, content: bytes, output_dir: str):
        """Decode zipfile bytes from HttpResponse into model files

        Args:
            content (bytes): Content from the API response
            output_dir (str): The directory to save the zip file to
        """
        z = zipfile.ZipFile(io.BytesIO(content))
        z.extractall(output_dir)

        # remove the __MACOSX file
        subprocess.call(
            [f"rm -r {output_dir}/__MACOSX"],
            shell=True,
            stderr=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
        )
